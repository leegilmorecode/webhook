import { validate } from "@webhook/schema-validator";
import { schema } from "./webhook.schema";

let item;

describe("webhook-schema", () => {
  beforeEach(() => {
    item = {
      providers: ["gas"],
      callbackUrl: "http://something/complete",
    };
  });

  describe("valid object", () => {
    it("should validate successfully", () => {
      expect(validate(item, schema)).toEqual(undefined);
    });
  });

  describe("invalid object", () => {
    it("should not validate when overposting", () => {
      item.somethingExtra = "test";

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        "Invalid: data should NOT have more than 2 items"
      );
    });

    it("should not validate when providers property is missing", () => {
      delete item.providers;

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        /Invalid: data should NOT have fewer than 2 items, data should have required property 'providers'/
      );
    });

    it("should not validate when callbackUrl property is missing", () => {
      delete item.callbackUrl;

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        /Invalid: data should NOT have fewer than 2 items, data should have required property 'callbackUrl'/
      );
    });

    it("should not validate when providers property is incorrect", () => {
      item.providers = ["test"];

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        "Invalid: data/providers/0 should be equal to one of the allowed values"
      );
    });

    it("should not validate when callbackUrl property is incorrect", () => {
      item.callbackUrl = 111;

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        "Invalid: data/callbackUrl should be string"
      );
    });
  });
});
