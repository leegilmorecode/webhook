import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { validate } from "@webhook/schema-validator";
import { initlogger } from "@webhook/logger";
import { schema } from "./webhook.schema";
import { processingStatus, awsConfigLocal, config } from "../../common";

const logger = initlogger();

export const handler = async ({ body }) => {
  const METHOD = "webhook.handler";

  try {
    logger.info(`${METHOD} - started`);

    const payload = JSON.parse(body);
    validate(payload, schema);

    logger.info(`${METHOD} - payload: ${JSON.stringify(payload)}`);

    awsConfigLocal(config.stage);

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { providers, callbackUrl } = payload;
    const jobId = uuid();

    const promises = providers.map((provider) => {
      const params = {
        TableName: config.jobTable,
        Item: {
          jobId,
          providerId: provider,
          callbackUrl,
          status: processingStatus.pending,
          date: new Date().toISOString(),
        },
      };

      logger.info(`${METHOD} - job: ${JSON.stringify(params)}`);

      return dynamoDb.put(params).promise();
    });

    await Promise.all(promises);
    logger.info(`${METHOD} - complete`);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Created"),
    };
  } catch (error) {
    logger.error(`${METHOD} - error: ${error}`);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("An error has occured", null, 2),
    };
  }
};
