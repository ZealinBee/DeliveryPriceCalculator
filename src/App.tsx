import { useState } from "react";

import "./App.css";
import PriceBreakdown from "./components/PriceBreakdown";
import DeliveryCalculatorForm from "./components/DeliveryCalculatorForm";

function App() {
  const [priceBreakdown, setPriceBreakdown] = useState({
    cartValue: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    smallOrderSurcharge: 0,
    totalPrice: 0,
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  return (
    <>
      <h1>Ultimate Delivery Order Price Calculator</h1>
      <DeliveryCalculatorForm
        setPriceBreakdown={setPriceBreakdown}
        setShowPriceBreakdown={setShowPriceBreakdown}
      />
      {showPriceBreakdown && <PriceBreakdown priceBreakdown={priceBreakdown} />}
    </>
  );
}

export default App;
