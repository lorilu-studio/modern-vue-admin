import { defineMock } from "./base";
import { getDemoAccount } from "./demo-account";

const account = getDemoAccount(import.meta.env.VITE_MOCK_DEMO_ROLE);

export default defineMock([
  {
    url: "users/me",
    method: ["GET"],
    body: {
      code: "00000",
      data: account,
      msg: "一切ok",
    },
  },
]);
