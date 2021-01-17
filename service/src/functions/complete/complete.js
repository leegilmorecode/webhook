import { validate } from "@webhook/schema-validator";
import { schema } from "./complete.schema";

export const handler = async ({ body }) => {
  try {
    const payload = JSON.parse(body);
    validate(payload, schema);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          message: "stubbed complete handler",
        },
        null,
        2
      ),
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
