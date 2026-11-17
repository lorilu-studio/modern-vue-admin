import { describe, expect, it } from "vitest";
import { getDemoAccount, getDemoRole } from "../mock/demo-account";

describe("demo accounts", () => {
  it("falls back to the administrator for an unknown role", () => {
    expect(getDemoRole("unknown")).toBe("admin");
    expect(getDemoAccount("unknown").roles).toEqual(["ROOT"]);
  });

  it("keeps the viewer read-only", () => {
    expect(getDemoAccount("viewer").perms).toEqual(["sys:user:query"]);
  });
});
