import { handler } from "./webhook";

describe("webhook", () => {
  it("should return the correct response", async () => {
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
    const result = await handler();
    expect(result).toEqual(expected);
  });
});
