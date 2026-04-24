import { useState, useEffect } from "react";

export const useShiprocketScript = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.HeadlessCheckout) {
      setIsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js";
    script.async = true;
    script.onload = () => setIsReady(true);

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return isReady;
};
