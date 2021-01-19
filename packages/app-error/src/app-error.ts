import { errorTypes, logLevels } from "./error-constants";

export class AppError extends Error {
  userMessage: string;
  internalMessage: string;
  errorType: number;
  loglevel: number;
  constructor({
    userMessage = "",
    internalMessage = "",
    errorType = errorTypes.ERROR,
    loglevel = logLevels.ERROR,
  }: {
    userMessage?: string;
    internalMessage?: string;
    errorType?: number;
    loglevel?: number;
  } = {}) {
    super(internalMessage);

    this.userMessage = userMessage;
    this.internalMessage = internalMessage;
    this.errorType = errorType;
    this.loglevel = loglevel;
  }
}
