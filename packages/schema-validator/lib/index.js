"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var ajv_1 = require("ajv");
function validate(obj, schema) {
    var ajv = new ajv_1.default({
        allErrors: true,
    });
    var validator = ajv.compile(schema);
    var valid = validator(obj);
    if (!valid) {
        var errorMessage = "Invalid: " + ajv.errorsText(validator.errors);
        throw new Error(errorMessage);
    }
}
exports.validate = validate;
