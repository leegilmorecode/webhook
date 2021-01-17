"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var schema = {
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
describe("validate", function () {
    it("should validate successfully with valid object", function () {
        var item = {
            id: "111",
            name: "John Smith",
        };
        expect(index_1.validate(item, schema)).toEqual(undefined);
    });
    it("should not validate an invalid object", function () {
        var item = {
            name: 1,
        };
        function invalid() {
            index_1.validate(item, schema);
        }
        expect(invalid).toThrowErrorMatchingInlineSnapshot("\"Invalid: data should NOT have fewer than 2 items, data should have required property 'id', data/name should be string\"");
    });
});
