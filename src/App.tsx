import { useState } from "react";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import { getDistance } from "geolib";
import axios from "axios";

import { deliveryCalculatorFormSchema } from "./schemas/deliveryCalculatorFormSchema";
import { coordinatesSchema } from "./schemas/coordinatesSchema";
import { orderCalculationSchema } from "./schemas/orderCalculationSchema";

import { formatPriceToCents } from "./utils/formatPriceToCentsUtil";
import { calculateDeliveryFee } from "./utils/calculateDeliveryFeeUtil";

import "./App.css";
import PriceBreakdown from "./components/PriceBreakdown";
import DeliveryCalculatorForm from "./components/DeliveryCalculatorForm";
import { calculateSmallOrderSurcharge } from "./utils/calculateSmallOrderSurcharge";

type FormFields = z.infer<typeof deliveryCalculatorFormSchema>;

function App() {
  const [priceBreakdown, setPriceBreakdown] = useState({
    cartValue: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    smallOrderSurcharge: 0,
    totalPrice: 0,
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(true);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const cartValueInCents = formatPriceToCents(formData.cartValue);
      const dynamicResponse = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/dynamic`
      );
      const staticResponse = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/static`
      );

      const venueLocation = coordinatesSchema.safeParse(staticResponse.data);
      const orderCalculationSpec = orderCalculationSchema.safeParse(
        dynamicResponse.data
      );
      if (!orderCalculationSpec.success || !venueLocation.success) {
        throw new Error(
          "Backend JSON has been changed, please notify the developers"
        );
      }

      const orderMinimumNoSurcharge =
        orderCalculationSpec.data.venue_raw.delivery_specs
          .order_minimum_no_surcharge;
      const basePrice =
        orderCalculationSpec.data.venue_raw.delivery_specs.delivery_pricing
          .base_price;
      const distanceRanges =
        orderCalculationSpec.data.venue_raw.delivery_specs.delivery_pricing
          .distance_ranges;
      const venueCoordinates =
        venueLocation.data.venue_raw.location.coordinates;

      const smallOrderSurcharge = calculateSmallOrderSurcharge(
        cartValueInCents,
        orderMinimumNoSurcharge
      );
      const deliveryDistance = getDistance(
        {
          latitude: formData.userLatitude,
          longitude: formData.userLongitude,
        },
        {
          latitude: venueCoordinates[1],
          longitude: venueCoordinates[0],
        }
      );
      const deliveryFee = calculateDeliveryFee(
        deliveryDistance,
        basePrice,
        distanceRanges
      );

      setPriceBreakdown({
        cartValue: cartValueInCents,
        deliveryFee: deliveryFee,
        deliveryDistance: deliveryDistance,
        smallOrderSurcharge: smallOrderSurcharge,
        totalPrice: cartValueInCents + deliveryFee + smallOrderSurcharge,
      });
    } catch (error) {
      console.error(error);
      // setError("venueSlug", {
      //   message: `Venue slug not found. try "home-assignment-venue-helsinki"`,
      // });
    }
  };

  return (
    <>
      <h1>Ultimate Delivery Order Price Calculator</h1>
      <DeliveryCalculatorForm onSubmit={onSubmit} />
      {showPriceBreakdown && <PriceBreakdown priceBreakdown={priceBreakdown} />}
    </>
  );
}

export default App;
