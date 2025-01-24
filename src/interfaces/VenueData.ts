import { DeliveryRange } from "./DeliveryRange";

export default interface VenueData {
  venueLatitude: number;
  venueLongitude: number;
  orderMinimumNoSurcharge: number;
  basePrice: number;
  deliveryRanges: DeliveryRange[];
}
