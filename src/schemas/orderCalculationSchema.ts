import { z } from "zod";

// Might seem quite nested but just using this to validate the response from the API
export const orderCalculationSchema = z
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
