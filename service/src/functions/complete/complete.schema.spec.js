import { validate } from "@webhook/schema-validator";
import { schema } from "./complete.schema";

let item;

describe("complete-schema", () => {
  beforeEach(() => {
    item = {
      jobId: "123",
      data: [
        {
          something: "something",
        },
      ],
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

    it("should not validate when jobId property is missing", () => {
      delete item.jobId;

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        /Invalid: data should NOT have fewer than 2 items, data should have required property 'jobId'/
      );
    });

    it("should not validate when data property is missing", () => {
      delete item.data;

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError(
        /Invalid: data should NOT have fewer than 2 items, data should have required property 'data'/
      );
    });

    it("should not validate when jobId property is incorrect", () => {
      item.jobId = 123; // not a string

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError("Invalid: data/jobId should be string");
    });

    it("should not validate when data property is incorrect", () => {
      item.data = true; // not an object

      function invalid() {
        validate(item, schema);
      }

      expect(invalid).toThrowError("Invalid: data/data should be array");
    });
  });
});
