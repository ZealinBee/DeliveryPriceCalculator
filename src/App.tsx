import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

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

function extractCoordinates(data: unknown) {
  const result = coordinatesSchema.safeParse(data);
  if (result.success) {
    return result.data.venue_raw.location.coordinates;
  }
  return null;
}

type FormFields = z.infer<typeof formSchema>;

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

  const onSubmit: SubmitHandler<FormFields> = async (data) => {};

  const onGetLocation = async () => {
    try {
      const formData = getValues();
      const response = await axios.get(
        `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${formData.venueSlug}/static`
      );
      const location = extractCoordinates(response.data);
      if (location) {
        setValue("userLongitude", location?.[0]);
        setValue("userLatitude", location?.[1]);
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
        {errors.venueSlug && <p>{errors.venueSlug.message}</p>}
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
      <div>
        <h2>Price Breakdown</h2>
        <p>
          Cart Value <span data-raw-value=""></span>
        </p>
        <p>
          Delivery Fee <span data-raw-value=""></span>
        </p>
        <p>
          Delivery Distance <span data-raw-value=""></span>
        </p>
        <p>
          Small order surcharge <span data-raw-value=""></span>
        </p>
        <p>
          Total Price <span data-raw-value=""></span>
        </p>
      </div>
    </>
  );
}

export default App;
