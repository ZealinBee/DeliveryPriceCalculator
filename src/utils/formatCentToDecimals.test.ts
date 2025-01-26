import {expect, test } from "vitest";

import { formatCentToDecimals } from "./formatCentToDecimals";

test("formats cents to decimals successfully", () => {
  const result = formatCentToDecimals(1000);

  expect(result).toBe("10.00");
});