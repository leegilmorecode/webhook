/* eslint-disable no-undef */
const AWS = {
  DynamoDB: {
    DocumentClient: jest.fn(() => {}),
  },
  config: {
    update: jest.fn(() => {}),
  },
  EnvironmentCredentials: jest.fn(() => {}),
};

export const mockQueryPromise = jest.fn().mockResolvedValue("result");
export const mockQuery = jest.fn(() => ({
  promise: mockQueryPromise,
}));

export const mockGetPromise = jest.fn().mockResolvedValue("result");
export const mockGet = jest.fn(() => ({
  promise: mockGetPromise,
}));

export const mockUpdatePromise = jest.fn().mockResolvedValue("result");
export const mockUpdate = jest.fn(() => ({
  promise: mockUpdatePromise,
}));

export const mockDeletePromise = jest.fn().mockResolvedValue("result");
export const mockDelete = jest.fn(() => ({
  promise: mockDeletePromise,
}));

export const mockPutPromise = jest.fn().mockResolvedValue("result");
export const mockPut = jest.fn(() => ({
  promise: mockPutPromise,
}));

AWS.DynamoDB.DocumentClient.prototype = {
  ...AWS.DynamoDB.DocumentClient.prototype,
  update: mockUpdate,
  get: mockGet,
  query: mockQuery,
  delete: mockDelete,
  put: mockPut,
};

AWS.EnvironmentCredentials.prototype = {
  ...AWS.EnvironmentCredentials.prototype,
};

export default AWS;
