import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { DistanceRanges } from "../interfaces/DistanceRanges";

export const calculateDeliveryFee = (
  deliveryDistance: number,
  basePrice: number,
  deliveryRanges: DistanceRanges[]
): number => {
  const deliveryRange = deliveryRanges.find(
    (range) => deliveryDistance >= range.min && deliveryDistance <= range.max
  );

  if (!deliveryRange) {
    throw new MaxDistanceExceededError("Max distance exceeded");
  }

  return (
    basePrice + deliveryRange.a + (deliveryRange.b * deliveryDistance) / 10
  );
};
