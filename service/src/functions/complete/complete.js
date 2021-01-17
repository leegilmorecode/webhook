export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        message: "stubbed complete handler",
      },
      null,
      2
    ),
  };
};
