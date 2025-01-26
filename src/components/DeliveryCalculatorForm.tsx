import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchVenueData } from "../api/fetchVenueData";

import { deliveryCalculatorFormSchema } from "../schemas/deliveryCalculatorFormSchema";

import { calculateSmallOrderSurcharge } from "../utils/calculateSmallOrderSurcharge";
import { getDistance } from "geolib";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { formatPriceToCents } from "../utils/formatPriceToCents";

import { MaxDistanceExceededError } from "../errors/MaxDistanceExceededError";
import { VenueNotFoundError } from "../errors/VenueNotFoundError";
import { ApiError } from "../errors/ApiError";

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
        throw new VenueNotFoundError(
          "Venue not found, are you sure the slug you entered was correct?"
        );
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
      setShowPriceBreakdown(false);
      if(error instanceof ApiError) {
        setError("venueSlug", {
          message: error.message,
        });
      }
      if (error instanceof VenueNotFoundError) {
        setError("venueSlug", {
          message: error.message,
        });
      }
      if (error instanceof MaxDistanceExceededError) {
        setError("userLongitude", {
          message: error.message,
        });
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="delivery-calculator-form"
      data-testid="form"
    >
      <label htmlFor="venue-slug-input">Venue Slug</label>
      <input
        {...register("venueSlug")}
        placeholder="home-assignment-venue-helsinki"
        required
        data-test-id="venueSlug"
        id="venue-slug-input"
        className={errors.venueSlug ? "error" : ""}
        aria-describedby={errors.venueSlug ? "venue-slug-error" : ""}
      />
      {errors.venueSlug && (
        <p className="error-message">{errors.venueSlug.message}</p>
      )}
      <label htmlFor="cart-value-input">Cart Value</label>
      <input
        {...register("cartValue")}
        placeholder="12.34"
        required
        data-test-id="cartValue"
        id="cart-value-input"
        className={errors.cartValue ? "error" : ""}
        aria-describedby={errors.cartValue ? "cart-value-error" : ""}
      />
      {errors.cartValue && (
        <p className="error-message">{errors.cartValue.message}</p>
      )}
      <label htmlFor="user-latitude-input">Your Latitude</label>
      <input
        {...register("userLatitude")}
        placeholder="60.17"
        required
        data-test-id="userLatitude"
        id="user-latitude-input"
        className={errors.userLatitude ? "error" : ""}
        aria-describedby={errors.userLatitude ? "user-latitude-error" : ""}
      />
      {errors.userLatitude && (
        <p className="error-message">{errors.userLatitude.message}</p>
      )}
      <label htmlFor="user-longitude-input">Your Longitude</label>
      <input
        {...register("userLongitude")}
        placeholder="24.93"
        required
        data-test-id="userLongitude"
        id="user-longitude-input"
        className={errors.userLongitude ? "error" : ""}
        aria-describedby={errors.userLongitude ? "user-longitude-error" : ""}
      />
      {errors.userLongitude && (
        <p className="error-message">{errors.userLongitude.message}</p>
      )}
      <button
        type="button"
        onClick={onGetLocation}
        className="get-location-button"
        data-test-id="getLocation"
      >
        Get Your Location
      </button>
      <button type="submit" data-test-id="calculateDeliveryPrice">Calculate Delivery Price</button>
      <div aria-live="polite">{isSubmitting && <p>Calculating...</p>}</div>
    </form>
  );
}

export default DeliveryCalculatorForm;
