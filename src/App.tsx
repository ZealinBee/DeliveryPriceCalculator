import { useState } from "react";
import { set, z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { getDistance } from "geolib";

import "./App.css";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  venueSlug: z.string().nonempty("Venue slug is required"),
  cartValue: z.coerce
    .number({
      invalid_type_error: "Cart value must be a number, i.e. 42.42",
    })
    .nonnegative("Cart value must be a positive number")
    .min(0, "Cart value must not be empty"),
  userLatitude: z.coerce
    .number({
      invalid_type_error: "User latitude must be a number, i.e. 41.303921",
    })
    .min(-90)
    .max(90),
  userLongitude: z.coerce
    .number({
      invalid_type_error: "User longitude must be a number, i.e. 81.901693",
    })
    .min(-180)
    .max(180),
});

const coordinatesSchema = z
  .object({
    venue_raw: z.object({
      location: z.object({
        coordinates: z.tuple([
          z.number().min(-180).max(180),
          z.number().min(-90).max(90),
        ]),
      }),
    }),
  })
  .passthrough();

// Might seem quite nested but just using this to validate the response from the API
const orderCalculationSchema = z
  .object({
    venue_raw: z.object({
      delivery_specs: z.object({
        order_minimum_no_surcharge: z.number(),
        delivery_pricing: z.object({
          base_price: z.number(),
          distance_ranges: z.array(
            z.object({
              min: z.number().int(),
              max: z.number().int(),
              a: z.number().int(),
              b: z.number().int(),
              flag: z.nullable(z.unknown()),
            })
          ),
        }),
      }),
    }),
  })
  .passthrough();

type FormFields = z.infer<typeof formSchema>;

function formatPriceToCents(price: number) {
  return price * 100;
}

function App() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });
  const [priceBreakdown, setPriceBreakdown] = useState({
    cartValue: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    smallOrderSurcharge: 0,
    totalPrice: 0,
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      let orderMinimumNoSurcharge = 0;
      let basePrice = 0;
      const distanceRanges = [];
      let venueLatitude = 0;
      let venueLongitude = 0;

      const dynamicResponse = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/dynamic`
      );
      const staticResponse = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/static`
      );
      const venueLocation = coordinatesSchema.safeParse(staticResponse.data);
      const orderCalcuationNumbers = orderCalculationSchema.safeParse(
        dynamicResponse.data
      );
      if (!orderCalcuationNumbers.success || !venueLocation.success) {
        // if there is an api JSON format change, apologize to the user THEN track the error and IMMEDIATELY notify the developers with something like trackApiError, telling that hey you changed the shape of the API, tell us first next time
      } else {
        orderMinimumNoSurcharge =
          orderCalcuationNumbers.data.venue_raw.delivery_specs
            .order_minimum_no_surcharge;
        basePrice =
          orderCalcuationNumbers.data.venue_raw.delivery_specs.delivery_pricing
            .base_price;
        distanceRanges.push(
          ...orderCalcuationNumbers.data.venue_raw.delivery_specs
            .delivery_pricing.distance_ranges
        );
        venueLatitude = venueLocation.data.venue_raw.location.coordinates[1];
        venueLongitude = venueLocation.data.venue_raw.location.coordinates[0];
      }
      let smallOrderSurcharge = 0;
      if (formatPriceToCents(formData.cartValue) < orderMinimumNoSurcharge) {
        smallOrderSurcharge =
          orderMinimumNoSurcharge - formatPriceToCents(formData.cartValue);
      }

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

      console.log("deliveryDistance", deliveryDistance);
      console.log("smallOrderSurcharge", smallOrderSurcharge);

      setPriceBreakdown({
        cartValue: formatPriceToCents(formData.cartValue),
        deliveryFee: 0,
        deliveryDistance: deliveryDistance,
        smallOrderSurcharge: smallOrderSurcharge,
        totalPrice: 0,
      });
    } catch (error) {
      console.error(error);
      setError("venueSlug", {
        message: `Venue slug not found. try "home-assignment-venue-helsinki"`,
      });
    }
  };

  const onGetLocation = async () => {
    try {
      const formData = getValues();
      const response = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/static`
      );
      const location = coordinatesSchema.safeParse(response.data);
      if (!location.success) {
        // if there is an api JSON format change, apologize to the user THEN track the error and IMMEDIATELY notify the developers with something like trackApiError, telling that hey you changed the shape of the API, tell us first next time
      } else if (location.success) {
        setValue(
          "userLatitude",
          location.data.venue_raw.location.coordinates[1]
        );
        setValue(
          "userLongitude",
          location.data.venue_raw.location.coordinates[0]
        );
      }
    } catch (error) {
      console.error(error);
      setError("venueSlug", {
        message: `Venue slug not found. try "home-assignment-venue-helsinki"`,
      });
    }
  };

  return (
    <>
      <h1>Ultimate Delivery Order Price Calculator</h1>
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
          Get Location
        </button>
        {errors.venueSlug && <p>{errors.venueSlug.message}</p>}
        <button type="submit">Calculate Delivery Price</button>
      </form>
      <div>{isSubmitting && <p>Calculating...</p>}</div>
      {/* {showPriceBreakdown && <PriceBreakdown />} */}
      <div>
        <h2>Price Breakdown</h2>
        <p>
          Cart Value{" "}
          <span data-raw-value={priceBreakdown.cartValue}>
            {(priceBreakdown.cartValue / 100).toFixed(2)} €
          </span>
        </p>
        <p>
          Delivery Fee{" "}
          <span data-raw-value="">{priceBreakdown.deliveryFee} </span>
        </p>
        <p>
          Delivery Distance{" "}
          <span data-raw-value={priceBreakdown.deliveryDistance}>
            {priceBreakdown.deliveryDistance} meters
          </span>
        </p>
        <p>
          Small order surcharge{" "}
          <span data-raw-value={priceBreakdown.smallOrderSurcharge}>
            {(priceBreakdown.smallOrderSurcharge / 100).toFixed(2)} €
          </span>
        </p>
        <p>
          Total Price <span data-raw-value="">{priceBreakdown.totalPrice}</span>
        </p>
      </div>
    </>
  );
}

export default App;
