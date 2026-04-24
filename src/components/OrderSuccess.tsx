// import { useSearchParams } from "react-router-dom";

// const OrderSuccess: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const userId = searchParams.get("userId"); // Get the logged-in user's ID
//   const redirectUUID = searchParams.get("attributes[fastrr_redirect_uuid]"); // Optional, Shiprocket info

//   return (
//     <div>
//       <h1>Order Success</h1>
//       <p>User ID: {userId}</p>
//       <p>Redirect UUID (optional): {redirectUUID}</p>
//     </div>
//   );
// };
// export default OrderSuccess;



import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const redirectUUID = searchParams.get("attributes[fastrr_redirect_uuid]");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Order Placed Successfully 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-500 mt-2">
          Thank you for your purchase! Your order has been confirmed.
        </p>

        {/* Order Info */}
        <div className="mt-6 space-y-3 text-left bg-gray-50 rounded-lg p-4">
          {userId && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Package className="h-4 w-4 text-gray-500" />
              <span>
                <strong>User ID:</strong> {userId}
              </span>
            </div>
          )}

          {redirectUUID && (
            <div className="text-xs text-gray-500 break-all">
              <strong>Redirect UUID:</strong> {redirectUUID}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
          >
            View My Orders
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
