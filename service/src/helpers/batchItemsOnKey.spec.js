import { batchItemsOnKey } from "./batchItemsOnKey";

describe("batchItemsOnKey", () => {
  it("should batch the items by key", () => {
    const data = [
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
    ];
    const expected = {
      111: [
        {
          callbackUrl: "http://example.com",
          date: "2021-01-18T05:35:20.406Z",
          jobId: "111",
          providerId: "gas",
          status: "PENDING",
        },
        {
          callbackUrl: "http://example.com",
          date: "2021-01-18T05:35:20.406Z",
          jobId: "111",
          providerId: "internet",
          status: "PENDING",
        },
      ],
      222: [
        {
          callbackUrl: "http://example.com",
          date: "2021-01-18T05:35:20.406Z",
          jobId: "222",
          providerId: "internet",
          status: "PENDING",
        },
        {
          callbackUrl: "http://example.com",
          date: "2021-01-18T05:35:20.406Z",
          jobId: "222",
          providerId: "gas",
          status: "PENDING",
        },
      ],
    };
    const result = batchItemsOnKey(data, "jobId");

    expect(result).toEqual(expected);
  });
});
