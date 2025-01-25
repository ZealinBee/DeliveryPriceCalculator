import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchVenueData } from "../api/fetchVenueData";

import { deliveryCalculatorFormSchema } from "../schemas/deliveryCalculatorFormSchema";

import { calculateSmallOrderSurcharge } from "../utils/calculateSmallOrderSurchargeUtil";
import { getDistance } from "geolib";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFeeUtil";
import { formatPriceToCents } from "../utils/formatPriceToCentsUtil";

import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { VenueNotFoundError } from "../errors/VenueNotFoundError";

type FormFields = z.infer<typeof deliveryCalculatorFormSchema>;

interface DeliveryCalculatorFormProps {
  setPriceBreakdown: (priceBreakdown: {
    cartValue: number;
    deliveryFee: number;
    deliveryDistance: number;
    smallOrderSurcharge: number;
    totalPrice: number;
  }) => void;
  setShowPriceBreakdown: (showPriceBreakdown: boolean) => void;
}

function DeliveryCalculatorForm({
  setPriceBreakdown,
  setShowPriceBreakdown,
}: DeliveryCalculatorFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(deliveryCalculatorFormSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const venueData = await fetchVenueData(formData.venueSlug);
      if (!venueData) {
        throw new VenueNotFoundError("Venue not found");
      }

      const {
        venueLatitude,
        venueLongitude,
        orderMinimumNoSurcharge,
        basePrice,
        deliveryRanges,
      } = venueData;
      const cartValueInCents = formatPriceToCents(formData.cartValue);

      const deliveryDistance = getDistance(
        {
          latitude: formData.userLatitude,
          longitude: formData.userLongitude,
        },
        {
          latitude: venueLatitude,
          longitude: venueLongitude,
        }
      );
      const deliveryFee = calculateDeliveryFee(
        deliveryDistance,
        basePrice,
        deliveryRanges
      );
      const smallOrderSurcharge = calculateSmallOrderSurcharge(
        cartValueInCents,
        orderMinimumNoSurcharge
      );

      setPriceBreakdown({
        cartValue: cartValueInCents,
        deliveryFee: deliveryFee,
        deliveryDistance: deliveryDistance,
        smallOrderSurcharge: smallOrderSurcharge,
        totalPrice: cartValueInCents + deliveryFee + smallOrderSurcharge,
      });
      setShowPriceBreakdown(true);
    } catch (error) {
      if (error instanceof VenueNotFoundError) {
        setError("venueSlug", {
          message:
            "Venue not found, try another venue slug like home-assignment-venue-helsinki",
        });
      }
      if (error instanceof MaxDistanceExceededError) {
        setError("userLongitude", {
          message:
            "Max distance exceeded, try another location that is within 2km, try 60.18012143 24.92813512(helsinki slug)",
        });
      }
    }
  };

  const onGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Please enter your location manually or try another browser."
      );
    }
  };

  const getLocationSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setValue("userLatitude", latitude);
    setValue("userLongitude", longitude);
  };

  const getLocationError = () => {
    alert(
      "Error occurred while getting your location. Please enter your location manually."
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("venueSlug")}
        placeholder="Venue Slug"
        required
        data-test-id="venueSlug"
      />
      {errors.venueSlug && <p>{errors.venueSlug.message}</p>}
      <input
        {...register("cartValue")}
        placeholder="Cart Value"
        required
        data-test-id="cartValue"
      />
      {errors.cartValue && <p>{errors.cartValue.message}</p>}
      <input
        {...register("userLatitude")}
        placeholder="Your Latitude"
        required
        data-test-id="userLatitude"
      />
      {errors.userLatitude && <p>{errors.userLatitude.message}</p>}
      <input
        {...register("userLongitude")}
        placeholder="Your Longitude"
        required
        data-test-id="userLongitude"
      />
      {errors.userLongitude && <p>{errors.userLongitude.message}</p>}
      <button type="button" onClick={onGetLocation}>
        Get Your Location
      </button>
      <button type="submit">Calculate Delivery Price</button>
      <div>{isSubmitting && <p>Calculating...</p>}</div>
    </form>
  );
}

export default DeliveryCalculatorForm;
