import { DeliveryRange } from "../interfaces/DeliveryRange"

export const calculateDeliveryFee = (deliveryDistance: number, basePrice: number, distanceRanges: DeliveryRange[]): number => {
    const deliveryRange = distanceRanges.find(range => deliveryDistance >= range.min && deliveryDistance <= range.max);


    if (!deliveryRange) {
        throw new Error('Distance is out of range');
    }

    return basePrice + deliveryRange.a + (deliveryRange.b * deliveryDistance) / 10;
}