import axios from "axios";
import { coordinatesSchema } from "../schemas/coordinatesSchema";
import { orderCalculationSchema } from "../schemas/orderCalculationSchema";
import { APIContractMismatchError } from "../errors/APIContractMismatchError";
import VenueData from "../interfaces/VenueData";

export const fetchVenueData = async (
  venueSlug: string
): Promise<VenueData | undefined> => {
  try {
    const dynamicResponse = await axios.get(
      `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`
    );
    const staticResponse = await axios.get(
      `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`
    );

    const venueLocation = coordinatesSchema.safeParse(staticResponse.data);
    const orderCalculationSpec = orderCalculationSchema.safeParse(
      dynamicResponse.data
    );
    // this error only occur if backend changed schema of the response, because the frontend is no longer able to parse the response
    if (!orderCalculationSpec.success || !venueLocation.success) {
      throw new APIContractMismatchError();
    }

    return {
      venueLatitude: venueLocation.data.venue_raw.location.coordinates[1],
      venueLongitude: venueLocation.data.venue_raw.location.coordinates[0],
      orderMinimumNoSurcharge:
        orderCalculationSpec.data.venue_raw.delivery_specs
          .order_minimum_no_surcharge,
      basePrice:
        orderCalculationSpec.data.venue_raw.delivery_specs.delivery_pricing
          .base_price,
      deliveryRanges:
        orderCalculationSpec.data.venue_raw.delivery_specs.delivery_pricing
          .distance_ranges,
    };
  } catch (error) {
    console.error(error);
  }
};
