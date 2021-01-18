import { handler } from "./complete";

describe("complete", () => {
  it("should return the correct response on success", async () => {
    const expected = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          message: {
            jobId: "123",
            data: [
              {
                something: "something",
              },
            ],
          },
        },
        null,
        2
      ),
    };
    const event = {
      body: JSON.stringify({
        jobId: "123",
        data: [
          {
            something: "something",
          },
        ],
      }),
    };
    const result = await handler(event);
    expect(result).toEqual(expected);
  });

  it("should return the correct response on error", async () => {
    const expected = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("An error has occured"),
    };
    const event = {
      body: JSON.stringify({}), // empty body
    };
    const result = await handler(event);
    expect(result).toEqual(expected);
  });
});
