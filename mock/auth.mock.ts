import { defineMock } from "./base";

export default defineMock([
  {
    url: "auth/login",
    method: ["POST"],
    body: {
      code: "00000",
      data: {
        accessToken: "mock-demo-token",
        tokenType: "Bearer",
        refreshToken: null,
        expires: null,
      },
      msg: "一切ok",
    },
  },
  {
    url: "auth/logout",
    method: ["DELETE"],
    body: {
      code: "00000",
      data: {},
      msg: "string",
    },
  },
]);
