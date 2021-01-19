import AWS from "aws-sdk";
import axios from "axios";
import { AppError, errorTypes, logLevels } from "@webhook/app-error";
import { initlogger } from "@webhook/logger";
import { processingStatus, awsConfigLocal, config } from "../../common";
import { batchItemsOnKey } from "../../helpers";

const logger = initlogger();

awsConfigLocal(config.stage);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function getPendingJobs() {
  const params = {
    TableName: config.jobTable,
    IndexName: config.jobsIndex,
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": processingStatus.pending,
    },
  };

  return dynamoDb.query(params).promise();
}

async function updateJob(job) {
  const params = {
    TableName: config.jobTable,
    Key: {
      jobId: job.jobId,
      providerId: job.providerId,
    },
    UpdateExpression: "set #status = :status, #data= :data",
    ExpressionAttributeNames: {
      "#status": "status",
      "#data": "data",
    },
    ExpressionAttributeValues: {
      ":status": processingStatus.complete,
      ":data": job.data,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDb.update(params).promise();
}

async function getData(item) {
  try {
    const { data } = await axios.get(
      `${config.serviceEndpoint}${item.providerId}`
    );
    return { ...item, data };
  } catch (error) {
    throw new AppError(
      `jobId: ${item.jobId} message: ${error.message}`,
      error.message,
      errorTypes.NOT_FOUND,
      logLevels.ERROR
    );
  }
}

async function postData(item) {
  try {
    const response = await axios.post(item.callbackUrl, {
      jobId: item.jobId,
      data: item.data,
    });
    return { ...item, response };
  } catch (error) {
    throw new AppError(
      `jobId: ${item.jobId} message: ${error.message}`,
      error.message,
      errorTypes.NOT_FOUND,
      logLevels.ERROR
    );
  }
}

async function processJob(jobs) {
  const results = jobs.map((job) => getData(job));
  return Promise.all(results);
}

function processCallback(jobs) {
  const item = {
    data: jobs.value,
    jobId: jobs.value[0].jobId,
    callbackUrl: jobs.value[0].callbackUrl,
  };
  return postData(item);
}

export const handler = async () => {
  const METHOD = "processor.handler";

  try {
    logger.info(`${METHOD} - started`);

    // get any pending jobs
    const { Items: items = [] } = await getPendingJobs();
    let batchedItems = batchItemsOnKey(items, "jobId");
    logger.info(`${METHOD} - batched items: ${JSON.stringify(batchedItems)}`);

    const processJobPromises = Object.values(batchedItems).map((item) =>
      processJob(item)
    );

    // process the job to get the relevant data
    const processJobresults = await Promise.allSettled(processJobPromises);
    logger.info(`${METHOD} - processed jobs: ${processJobresults.length}`);

    const fulfilledJobs = processJobresults.filter(
      (item) => item.status === "fulfilled"
    );

    const processCallbackPromises = Object.values(fulfilledJobs).map((item) =>
      processCallback(item)
    );

    // for any jobs that have the relevant data send to the callback url
    const processCallbackResults = await Promise.allSettled(
      processCallbackPromises
    );
    logger.info(
      `${METHOD} - processed callbacks: ${processCallbackResults.length}`
    );

    const fulfilledCallbacks = processCallbackResults.filter(
      (item) => item.status === "fulfilled"
    );

    // for any successful callbacks update the database to be processed (along with the data)
    const updatePromises = fulfilledCallbacks.map((processedJob) =>
      processedJob.value.data.map((job) => updateJob(job))
    );
    await Promise.all(updatePromises);

    logger.info(`${METHOD} - complete`);
  } catch (error) {
    logger.error(`${METHOD} - error: ${error}`);

    throw new AppError(
      "Uncaught error",
      error.message,
      errorTypes.NOT_FOUND,
      logLevels.ERROR
    );
  }
};
