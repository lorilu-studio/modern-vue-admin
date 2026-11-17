import { describe, expect, it } from "vitest";
import { isInDateRange, paginate } from "../src/utils/list-data";

describe("list data helpers", () => {
  it("includes both boundaries when filtering an ISO datetime", () => {
    expect(
      isInDateRange("2026-09-15 10:24", ["2026-09-15", "2026-09-15"])
    ).toBe(true);
    expect(
      isInDateRange("2026-09-14 23:59", ["2026-09-15", "2026-09-15"])
    ).toBe(false);
  });

  it("returns only the rows for the requested one-based page", () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });
});
