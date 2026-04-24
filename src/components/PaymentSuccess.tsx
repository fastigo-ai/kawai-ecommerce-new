import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { updateShiprocketOrderStatus } from "../APi/api";
import { CheckCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext"; // adjust path if needed

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const orderId = searchParams.get("orderId"); // internal DB order
  const oid = searchParams.get("oid"); // Shiprocket platform_order_id
  const ost = searchParams.get("ost"); // Shiprocket order status

  useEffect(() => {
    if (!orderId || !oid) return;

    const updateOrder = async () => {
      try {
        await updateShiprocketOrderStatus(orderId, oid);

        // ✅ Clear cart if status is SUCCESS
        if (ost === "SUCCESS") {
          clearCart();
        }
      } catch (err) {
        console.error("Error updating order:", err);
      }
    };

    updateOrder();
  }, [orderId, oid, ost]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-200 px-4">
      {/* Success Icon */}
      <div className="bg-white rounded-full p-6 shadow-lg animate-bounce">
        <CheckCircle className="text-green-500 w-16 h-16" />
      </div>

      {/* Heading */}
      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800 text-center">
        Payment Successful!
      </h1>

      {/* Subheading */}
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Thank you for your order. We are updating your order status and preparing it for shipment. You will receive a confirmation shortly.
      </p>

      {/* Order Details */}
      {orderId && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-gray-700">
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <p className="text-gray-700 mt-1">
            <span className="font-semibold">Shiprocket ID:</span> {oid}
          </p>
        </div>
      )}

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default CheckoutSuccess;
