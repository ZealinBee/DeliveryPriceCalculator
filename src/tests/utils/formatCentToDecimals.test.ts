import {expect, test } from "vitest";

import { formatCentToDecimals } from "../../utils/formatCentToDecimals";

test("formats cents to decimals successfully", () => {
  const result = formatCentToDecimals(1000);

  expect(result).toBe("10.00");
});