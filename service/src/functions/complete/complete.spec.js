import { handler } from "./complete";

describe("complete", () => {
  it("should return the correct response", async () => {
    const expected = {
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
    const result = await handler();
    expect(result).toEqual(expected);
  });
});
