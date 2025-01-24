import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { deliveryCalculatorFormSchema } from "../schemas/deliveryCalculatorFormSchema";

import { calculateSmallOrderSurcharge } from "../utils/calculateSmallOrderSurchargeUtil";
import { getDistance } from "geolib";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFeeUtil";
import { formatPriceToCents } from "../utils/formatPriceToCentsUtil";
import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { fetchVenueData } from "../api/fetchVenueData";

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
      const cartValueInCents = formatPriceToCents(formData.cartValue);

      const venueData = await fetchVenueData(formData.venueSlug);
      if(!venueData) {
        throw new Error("Venue data not found");
      }
      const { venueLatitude, venueLongitude, orderMinimumNoSurcharge, basePrice, deliveryRanges } = venueData;

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
          latitude: venueLatitude,
          longitude: venueLongitude,
        }
      );
      const deliveryFee = calculateDeliveryFee(
        deliveryDistance,
        basePrice,
        deliveryRanges
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
      console.error(error);
      if (error as AxiosError) {
        setError("venueSlug", {
          message: `Venue slug not found. try "home-assignment-venue-helsinki.`,
        });
      }
      if (error instanceof MaxDistanceExceededError) {
        setError("userLatitude", {
          message: error.message,
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
        placeholder="venue slug"
        required
        data-test-id="venueSlug"
      />
      <input
        {...register("cartValue")}
        placeholder="cart value"
        required
        data-test-id="cartValue"
      />
      {errors.cartValue && <p>{errors.cartValue.message}</p>}
      <input
        {...register("userLatitude")}
        placeholder="user latitude"
        required
        data-test-id="userLatitude"
      />
      {errors.userLatitude && <p>{errors.userLatitude.message}</p>}
      <input
        {...register("userLongitude")}
        placeholder="user longitude"
        required
        data-test-id="userLongitude"
      />
      {errors.userLongitude && <p>{errors.userLongitude.message}</p>}
      <button type="button" onClick={onGetLocation}>
        Get Your Location
      </button>
      {errors.venueSlug && <p>{errors.venueSlug.message}</p>}
      <button type="submit">Calculate Delivery Price</button>
      <div>{isSubmitting && <p>Calculating...</p>}</div>
    </form>
  );
}

export default DeliveryCalculatorForm;
