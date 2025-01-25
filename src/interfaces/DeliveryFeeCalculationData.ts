import { DistanceRanges } from "./DistanceRanges";

export interface DeliveryFeeCalculationData {
  venue_raw: {
    delivery_specs: {
      order_minimum_no_surcharge: number;
      delivery_pricing: {
        base_price: number;
        distance_ranges: DistanceRanges[];
      };
    };
  };
}
