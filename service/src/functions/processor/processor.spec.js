import MockDate from "mockdate";
import { handler } from "./processor";
import { mockQuery, mockQueryPromise, mockUpdate } from "aws-sdk";
import { mockGetPromise, mockPostPromise } from "axios";

let event;

describe("processor", () => {
  beforeAll(() => {
    MockDate.set("2021-01-01");
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryPromise.mockResolvedValue({
      Items: [
        {
          jobId: "111",
          providerId: "gas",
          status: "PENDING",
          date: "2021-01-18T05:35:20.406Z",
          callbackUrl: "http://example.com",
        },
        {
          jobId: "111",
          providerId: "internet",
          status: "PENDING",
          date: "2021-01-18T05:35:20.406Z",
          callbackUrl: "http://example.com",
        },
        {
          jobId: "222",
          providerId: "internet",
          status: "PENDING",
          date: "2021-01-18T05:35:20.406Z",
          callbackUrl: "http://example.com",
        },
        {
          jobId: "222",
          providerId: "gas",
          status: "PENDING",
          date: "2021-01-18T05:35:20.406Z",
          callbackUrl: "http://example.com",
        },
      ],
    });
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should get the pending records to process", async () => {
    await handler(event);
    expect(mockQuery.mock.calls).toEqual([
      [
        {
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":status": "PENDING" },
          IndexName: "StatusIndex",
          KeyConditionExpression: "#status = :status",
          TableName: "job-table",
        },
      ],
    ]);
  });

  it("should get the data for pending records", async () => {
    // mockGetPromise.mockRejectedValueOnce(new Error("internal server error"));

    await handler(event);
    expect(mockGetPromise.mock.calls).toEqual([
      ["http://localhost:3000/providers/gas"],
      ["http://localhost:3000/providers/internet"],
      ["http://localhost:3000/providers/internet"],
      ["http://localhost:3000/providers/gas"],
    ]);
  });

  it("should post the data for jobs which have returned data successfully", async () => {
    await handler(event);
    expect(mockPostPromise.mock.calls).toEqual([
      [
        "http://example.com",
        {
          data: [
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "111",
              providerId: "gas",
              status: "PENDING",
            },
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "111",
              providerId: "internet",
              status: "PENDING",
            },
          ],
          jobId: "111",
        },
      ],
      [
        "http://example.com",
        {
          data: [
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "222",
              providerId: "internet",
              status: "PENDING",
            },
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "222",
              providerId: "gas",
              status: "PENDING",
            },
          ],
          jobId: "222",
        },
      ],
    ]);
  });

  it("should not post the data for jobs which have one or more errors", async () => {
    mockGetPromise.mockRejectedValueOnce(new Error("internal server error")); // throw an error in jobId 111 for one of the calls

    await handler(event);
    expect(mockPostPromise.mock.calls).toEqual([
      [
        "http://example.com",
        {
          data: [
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "222",
              providerId: "internet",
              status: "PENDING",
            },
            {
              callbackUrl: "http://example.com",
              data: "result",
              date: "2021-01-18T05:35:20.406Z",
              jobId: "222",
              providerId: "gas",
              status: "PENDING",
            },
          ],
          jobId: "222",
        },
      ],
    ]);
  });

  it("should update the status to complete for any processed records only", async () => {
    mockGetPromise.mockRejectedValueOnce(new Error("internal server error")); // throw an error in jobId 111 for one of the calls
    await handler(event);
    expect(mockUpdate.mock.calls).toEqual([
      [
        {
          ExpressionAttributeNames: { "#data": "data", "#status": "status" },
          ExpressionAttributeValues: {
            ":data": "result",
            ":status": "COMPLETE",
          },
          Key: { jobId: "222", providerId: "internet" },
          ReturnValues: "UPDATED_NEW",
          TableName: "job-table",
          UpdateExpression: "set #status = :status, #data= :data",
        },
      ],
      [
        {
          ExpressionAttributeNames: { "#data": "data", "#status": "status" },
          ExpressionAttributeValues: {
            ":data": "result",
            ":status": "COMPLETE",
          },
          Key: { jobId: "222", providerId: "gas" },
          ReturnValues: "UPDATED_NEW",
          TableName: "job-table",
          UpdateExpression: "set #status = :status, #data= :data",
        },
      ],
    ]);
  });
});
