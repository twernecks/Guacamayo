import { describe, expect, it } from "vitest";
import { validateDateRange } from "@/domain/admin/leads-validation";

describe("validateDateRange", () => {
  it("accepts when from is before to", () => {
    expect(validateDateRange("2026-01-01", "2026-01-31")).toBe(true);
  });

  it("accepts when from equals to", () => {
    expect(validateDateRange("2026-01-15", "2026-01-15")).toBe(true);
  });

  it("rejects when from is after to", () => {
    expect(validateDateRange("2026-02-01", "2026-01-01")).toBe(false);
  });

  it("accepts when either bound is missing", () => {
    expect(validateDateRange(undefined, "2026-01-31")).toBe(true);
    expect(validateDateRange("2026-01-01", undefined)).toBe(true);
    expect(validateDateRange(undefined, undefined)).toBe(true);
  });
});
