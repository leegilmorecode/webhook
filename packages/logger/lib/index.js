"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initlogger = exports.winstonLogger = void 0;
var winston = require("winston");
exports.winstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level: "error",
        }),
        new winston.transports.File({
            filename: "combined.log",
        }),
    ],
});
var initlogger = function () {
    if (process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "local") {
        exports.winstonLogger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
    return exports.winstonLogger;
};
exports.initlogger = initlogger;
