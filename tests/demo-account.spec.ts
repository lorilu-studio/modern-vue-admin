import { describe, expect, it } from "vitest";
import { getDemoAccount, getDemoRole } from "../mock/demo-account";

describe("demo accounts", () => {
  it("falls back to the viewer for an unknown role", () => {
    expect(getDemoRole("unknown")).toBe("viewer");
    expect(getDemoAccount("unknown").roles).toEqual(["VIEWER"]);
  });

  it("keeps the viewer read-only", () => {
    expect(getDemoAccount("viewer").perms).toEqual(["sys:user:query"]);
  });
});
