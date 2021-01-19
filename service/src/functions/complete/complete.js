import { validate } from "@webhook/schema-validator";
import { initlogger } from "@webhook/logger";
import { schema } from "./complete.schema";

const logger = initlogger();

export const handler = async ({ body }) => {
  const METHOD = "complete.handler";

  try {
    logger.info(`${METHOD} - started`);

    const payload = JSON.parse(body);
    validate(payload, schema);

    logger.info(`${METHOD} - payload: ${JSON.stringify(payload)}`);

    logger.info(`${METHOD} - complete`);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          message: payload,
        },
        null,
        2
      ),
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
