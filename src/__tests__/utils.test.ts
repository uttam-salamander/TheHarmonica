/**
 * Tests for utility functions
 * @module utils.test
 */

import { describe, expect, test } from "bun:test";
import { cn } from "@/lib/utils";

describe("cn (className merger)", () => {
  test("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  test("returns single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  test("merges multiple classes", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  test("handles conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active"
    );
  });

  test("resolves conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge should resolve conflicts
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  test("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "other")).toBe("base other");
  });

  test("handles false values", () => {
    expect(cn("base", false, "other")).toBe("base other");
  });

  test("handles array inputs", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
  });

  test("handles object inputs", () => {
    expect(
      cn({
        "text-red-500": true,
        "text-blue-500": false,
        "bg-green-500": true,
      })
    ).toBe("text-red-500 bg-green-500");
  });

  test("complex real-world example", () => {
    const variant: string = "primary";
    const size: string = "lg";
    const disabled = false;

    const result = cn(
      "base-button",
      variant === "primary" && "bg-blue-500 text-white",
      variant === "secondary" && "bg-gray-200 text-gray-800",
      size === "sm" && "px-2 py-1 text-sm",
      size === "lg" && "px-4 py-2 text-lg",
      disabled && "opacity-50 cursor-not-allowed"
    );

    expect(result).toBe("base-button bg-blue-500 text-white px-4 py-2 text-lg");
  });
});
