import { handler } from "./webhook";

describe("webhook", () => {
  it("should return the correct response on success", async () => {
    const expected = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          message: "stubbed webhook handler",
        },
        null,
        2
      ),
    };
    const event = {
      body: JSON.stringify({
        providers: ["gas"],
        callbackUrl: "http://something/complete",
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
