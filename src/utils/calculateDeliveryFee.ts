import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { DistanceRange } from "../interfaces/DistanceRange";

export const calculateDeliveryFee = (
  deliveryDistance: number,
  basePrice: number,
  deliveryRanges: DistanceRange[]
): number => {
  const deliveryRange = deliveryRanges.find(
    (range) => deliveryDistance >= range.min && deliveryDistance <= range.max
  );

  if (!deliveryRange) {
    const maxDistance = deliveryRanges[deliveryRanges.length - 1].min;
    throw new MaxDistanceExceededError(
      `Your distance is too far from this venue (over ${maxDistance}m), please try another venue.`
    );
  }

  return (
    basePrice + deliveryRange.a + (deliveryRange.b * deliveryDistance) / 10
  );
};
