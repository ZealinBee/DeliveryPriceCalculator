import { useState } from "react";

import "./styles/main.scss";
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
    <div className="app">
      <h1>Delivery Order Price Calculator</h1>
      <DeliveryCalculatorForm
        setPriceBreakdown={setPriceBreakdown}
        setShowPriceBreakdown={setShowPriceBreakdown}
      />
      {showPriceBreakdown && <PriceBreakdown priceBreakdown={priceBreakdown} />}
    </div>
  );
}

export default App;
