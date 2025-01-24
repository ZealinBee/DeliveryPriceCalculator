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
        <span data-raw-value={priceBreakdown.deliveryFee}>
          {(priceBreakdown.deliveryFee / 100).toFixed(2)} €
        </span>
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
        Total Price{" "}
        <span data-raw-value="">
          {(priceBreakdown.totalPrice / 100).toFixed(2)} €
        </span>
      </p>
    </div>
  );
}

export default PriceBreakdown;
