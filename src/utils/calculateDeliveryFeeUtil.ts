import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { DeliveryRange } from "../interfaces/DeliveryRange";

export const calculateDeliveryFee = (
  deliveryDistance: number,
  basePrice: number,
  deliveryRanges: DeliveryRange[]
): number => {
  const deliveryRange = deliveryRanges.find(
    (range) => deliveryDistance >= range.min && deliveryDistance <= range.max
  );

  if (!deliveryRange) {
    throw new MaxDistanceExceededError();
  }

  return (
    basePrice + deliveryRange.a + (deliveryRange.b * deliveryDistance) / 10
  );
};
