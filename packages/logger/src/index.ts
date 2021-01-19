import * as winston from "winston";

export const winstonLogger = winston.createLogger({
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

export const initlogger = () => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "local"
  ) {
    winstonLogger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  return winstonLogger;
};
