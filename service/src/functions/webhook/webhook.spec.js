import MockDate from "mockdate";
import { handler } from "./webhook";
import { mockPut } from "aws-sdk";

let event;

describe("webhook", () => {
  beforeAll(() => {
    MockDate.set("2021-01-01");
  });

  beforeEach(() => {
    event = {
      body: JSON.stringify({
        providers: ["gas", "internet"],
        callbackUrl: "http://something/complete",
      }),
    };
    jest.clearAllMocks();
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should return the correct response on success", async () => {
    const expected = {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Created"),
    };

    const result = await handler(event);
    expect(result).toEqual(expected);
  });

  it("should write the correct records on success", async () => {
    await handler(event);
    expect(mockPut.mock.calls).toEqual([
      [
        {
          Item: {
            callbackUrl: "http://something/complete",
            date: "2021-01-01T00:00:00.000Z",
            jobId: "a6acf5b9-9be2-4840-a325-84087583f47e",
            providerId: "gas",
            status: "PENDING",
          },
          TableName: "job-table",
        },
      ],
      [
        {
          Item: {
            callbackUrl: "http://something/complete",
            date: "2021-01-01T00:00:00.000Z",
            jobId: "a6acf5b9-9be2-4840-a325-84087583f47e",
            providerId: "internet",
            status: "PENDING",
          },
          TableName: "job-table",
        },
      ],
    ]);
  });

  it("should throw an error if body is not validated", async () => {
    const expected = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("An error has occured"),
    };
    const event = {
      body: JSON.stringify({
        test: "something", // invalid body
      }),
    };
    const result = await handler(event);
    expect(result).toEqual(expected);
  });
});
