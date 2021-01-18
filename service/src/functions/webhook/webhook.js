import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { validate } from "@webhook/schema-validator";
import { schema } from "./webhook.schema";
import { processingStatus, awsConfigLocal, config } from "../../common";

export const handler = async ({ body }) => {
  try {
    const payload = JSON.parse(body);
    validate(payload, schema);

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

      return dynamoDb.put(params).promise();
    });

    await Promise.all(promises);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Created"),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("An error has occured", null, 2),
    };
  }
};
