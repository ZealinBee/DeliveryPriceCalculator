import { z } from "zod";

export const deliveryCalculatorFormSchema = z.object({
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
