import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { deliveryCalculatorFormSchema } from "../schemas/deliveryCalculatorFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormFields = z.infer<typeof deliveryCalculatorFormSchema>;

interface DeliveryCalculatorFormProps {
  onSubmit: SubmitHandler<FormFields>;
}

function DeliveryCalculatorForm({ onSubmit }: DeliveryCalculatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(deliveryCalculatorFormSchema),
  });

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
