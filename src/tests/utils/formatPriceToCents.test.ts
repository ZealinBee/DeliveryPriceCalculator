import {expect, test } from "vitest";

import { formatPriceToCents } from "../../utils/formatPriceToCents";

test("formats price to cents successfully", () => {
  const result = formatPriceToCents(10.12);

  expect(result).toBe(1012);
});

test("formats high decimal price to cents successfully", () => {
  const result = formatPriceToCents(10.129231);

  expect(result).toBe(1013);
});
