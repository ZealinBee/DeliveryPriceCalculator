import { expect, test } from "vitest";

import { calculateSmallOrderSurcharge } from "./calculateSmallOrderSurcharge";

test("calculates small order surcharge successfully when order is below 1000 cents", () => {
  const cartValueInCents = 900;
  const orderMinimumNoSurcharge = 1000;

  const result = calculateSmallOrderSurcharge(cartValueInCents, orderMinimumNoSurcharge);

  expect(result).toBe(100);
});

test("returns 0 when order is above or equal to 1000 cents", () => {
  const cartValueInCents = 1000;
  const orderMinimumNoSurcharge = 1000;

  const result = calculateSmallOrderSurcharge(cartValueInCents, orderMinimumNoSurcharge);

  expect(result).toBe(0);
});