/* eslint-disable no-undef */
export const mockGetPromise = jest.fn().mockResolvedValue({ data: "result" });
export const mockPostPromise = jest
  .fn()
  .mockResolvedValue({ data: {}, status: 200 });

const Axios = {
  get: mockGetPromise,
  post: mockPostPromise,
};

export default Axios;
