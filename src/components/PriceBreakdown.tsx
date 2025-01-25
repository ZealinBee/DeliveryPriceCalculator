import { formatCentToDecimals } from "../utils/formatCentToDecimalsUtil";

interface PriceBreakdownProps {
  priceBreakdown: {
    cartValue: number;
    deliveryFee: number;
    deliveryDistance: number;
    smallOrderSurcharge: number;
    totalPrice: number;
  };
}

function PriceBreakdown({ priceBreakdown }: PriceBreakdownProps) {
  return (
    <div className="price-breakdown">
      <h2>Price Breakdown</h2>
      <p>
        Cart Value{" "}
        <span data-raw-value={priceBreakdown.cartValue}>
          €{formatCentToDecimals(priceBreakdown.cartValue)}
        </span>
      </p>
      <p>
        Delivery Fee{" "}
        <span data-raw-value={priceBreakdown.deliveryFee}>
          €{formatCentToDecimals(priceBreakdown.deliveryFee)}
        </span>
      </p>
      <p>
        Delivery Distance{" "}
        <span data-raw-value={priceBreakdown.deliveryDistance}>
          {priceBreakdown.deliveryDistance} meters
        </span>
      </p>
      <p>
        Small Order Surcharge{" "}
        <span data-raw-value={priceBreakdown.smallOrderSurcharge}>
          €{formatCentToDecimals(priceBreakdown.smallOrderSurcharge)}
        </span>
      </p>
      <p>
        Total Price{" "}
        <span data-raw-value={priceBreakdown.totalPrice}>
          €{formatCentToDecimals(priceBreakdown.totalPrice)}
        </span>
      </p>
    </div>
  );
}

export default PriceBreakdown;
