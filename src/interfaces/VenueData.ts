import { DistanceRanges } from "./DistanceRanges";

export interface VenueData {
  venueLatitude: number;
  venueLongitude: number;
  orderMinimumNoSurcharge: number;
  basePrice: number;
  deliveryRanges: DistanceRanges[];
}
