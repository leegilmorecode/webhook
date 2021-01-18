export const schema = {
  type: "object",
  required: ["jobId", "data"],
  maxProperties: 2,
  minProperties: 2,
  properties: {
    jobId: {
      type: "string",
    },
    data: {
      type: "array",
    },
  },
};
