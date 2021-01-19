"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
var error_constants_1 = require("./error-constants");
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.userMessage, userMessage = _c === void 0 ? "" : _c, _d = _b.internalMessage, internalMessage = _d === void 0 ? "" : _d, _e = _b.errorType, errorType = _e === void 0 ? error_constants_1.errorTypes.ERROR : _e, _f = _b.loglevel, loglevel = _f === void 0 ? error_constants_1.logLevels.ERROR : _f;
        var _this = _super.call(this, internalMessage) || this;
        _this.userMessage = userMessage;
        _this.internalMessage = internalMessage;
        _this.errorType = errorType;
        _this.loglevel = loglevel;
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
