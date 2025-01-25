import { DistanceRange } from "./DistanceRange";

export interface VenueData {
  venueLatitude: number;
  venueLongitude: number;
  orderMinimumNoSurcharge: number;
  basePrice: number;
  deliveryRanges: DistanceRange[];
}
