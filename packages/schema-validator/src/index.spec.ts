import { validate } from "./index";

const schema = {
  type: "object",
  required: ["id", "name"],
  maxProperties: 2,
  minProperties: 2,
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
};

describe("validate", () => {
  it("should validate successfully with valid object", () => {
    const item = {
      id: "111",
      name: "John Smith",
    };

    expect(validate(item, schema)).toEqual(undefined);
  });

  it("should not validate an invalid object", () => {
    const item = {
      name: 1,
    };

    function invalid() {
      validate(item, schema);
    }

    expect(invalid).toThrowErrorMatchingInlineSnapshot(
      `"Invalid: data should NOT have fewer than 2 items, data should have required property 'id', data/name should be string"`
    );
  });
});
