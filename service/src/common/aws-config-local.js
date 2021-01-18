import AWS from "aws-sdk";

export const awsConfigLocal = (stage) => {
  if (stage === "local") {
    AWS.config.update({
      accessKeyId: "default",
      secretAccessKey: "default",
      endpoint: "host.docker.internal:4566",
    });
  }
};
