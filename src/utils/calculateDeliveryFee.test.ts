import { expect, test } from "vitest";

import { calculateDeliveryFee } from "./calculateDeliveryFee";
import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";

const deliveryRanges = [
  {
    min: 0,
    max: 500,
    a: 0,
    b: 0,
    flag: null,
  },
  {
    min: 500,
    max: 1000,
    a: 100,
    b: 0,
    flag: null,
  },
  {
    min: 1000,
    max: 1500,
    a: 200,
    b: 0,
    flag: null,
  },
  {
    min: 1500,
    max: 2000,
    a: 200,
    b: 1,
    flag: null,
  },
  {
    min: 2000,
    max: 0,
    a: 0,
    b: 0,
    flag: null,
  },
]

test("calculates delivery fees successfully within allowed distance", () => {
  const deliveryDistance = 1000;
  const basePrice = 190;

  const result = calculateDeliveryFee(
    deliveryDistance,
    basePrice,
    deliveryRanges
  );

  expect(result).toBe(290); // formula: base_price + a + (b * distance / 10)
});

test("throws an error if max delivery distance is exceeded", () => {
  const deliveryDistance = 2500;
  const basePrice = 190;

  const maxDistance = deliveryRanges[deliveryRanges.length - 1].min;
  expect(() =>
    calculateDeliveryFee(deliveryDistance, basePrice, deliveryRanges)
  ).toThrowError(
    new MaxDistanceExceededError(`Your distance is too far from this venue (over ${maxDistance}m), please try another venue.`)
  );
});
