export const schema = {
  type: "object",
  required: ["providers", "callbackUrl"],
  maxProperties: 2,
  minProperties: 2,
  properties: {
    providers: {
      type: "array",
      items: {
        type: "string",
        enum: ["gas", "internet"],
      },
    },
    callbackUrl: {
      type: "string",
      pattern: "^https?://", // basic validation for demo only
    },
  },
};
