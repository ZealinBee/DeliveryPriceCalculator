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
      `Max distance exceeded for this venue (${maxDistance}m), try 60.18 24.92(with home-assignment-venue-helsinki as venue slug)`
    );
  }

  return (
    basePrice + deliveryRange.a + (deliveryRange.b * deliveryDistance) / 10
  );
};
