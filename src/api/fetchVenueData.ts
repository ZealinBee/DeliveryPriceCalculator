import axios, { AxiosError } from "axios";

import { VenueData } from "../interfaces/VenueData";
import { CoordinateData } from "../interfaces/CoordinateData";
import { DeliveryFeeCalculationData } from "../interfaces/DeliveryFeeCalculationData";
import { ApiError } from "../errors/ApiError";

export const fetchVenueData = async (
  venueSlug: string
): Promise<VenueData | undefined> => {
  try {
    const [deliveryFeeCalculationResponse, coordinateResponse] =
      await Promise.all([
        await axios.get<DeliveryFeeCalculationData>(
          `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`
        ),
        await axios.get<CoordinateData>(
          `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`
        ),
      ]);

    return {
      venueLatitude: coordinateResponse.data.venue_raw.location.coordinates[1],
      venueLongitude: coordinateResponse.data.venue_raw.location.coordinates[0],
      orderMinimumNoSurcharge:
        deliveryFeeCalculationResponse.data.venue_raw.delivery_specs
          .order_minimum_no_surcharge,
      basePrice:
        deliveryFeeCalculationResponse.data.venue_raw.delivery_specs
          .delivery_pricing.base_price,
      deliveryRanges:
        deliveryFeeCalculationResponse.data.venue_raw.delivery_specs
          .delivery_pricing.distance_ranges,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new ApiError("Network error, please try again later.");
      }
    }
  }
};
