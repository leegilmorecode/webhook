export declare class AppError extends Error {
    userMessage: string;
    internalMessage: string;
    errorType: number;
    loglevel: number;
    constructor({ userMessage, internalMessage, errorType, loglevel, }?: {
        userMessage?: string;
        internalMessage?: string;
        errorType?: number;
        loglevel?: number;
    });
}
