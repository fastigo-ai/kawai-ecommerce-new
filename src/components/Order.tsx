import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, CreditCard } from "lucide-react";
import { getUserOrders } from "../APi/api";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <text x='50%' y='50%' dominant-baseline='middle'
      text-anchor='middle' fill='#9ca3af'
      font-size='18'>No Image</text>
  </svg>
`);

const Order = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders(userId); // ✅ no userId
        if (!res?.orders || !Array.isArray(res.orders)) {
          setError("No orders found");
          return;
        }
        setOrders(res.orders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const currency = (v = 0) =>
    Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const statusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="text-green-600" />;
      case "shipped":
        return <Truck className="text-yellow-500" />;
      default:
        return <Package className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your orders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order, index) => {
          const subtotal = order.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          const shipping = order.shipping_charges || 0;
          const tax = order.taxAmount || 0;
          const discount = order.discountAmount || 0;
          const total = subtotal + shipping + tax - discount;

          const shippingAddress =
            order.shiprocketPayload?.shipping_address;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border rounded-lg p-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Order Status: {order.status}<br />
                    Payment Status: {order.paymentStatus}

                  </p>
                </div>
                {statusIcon(order.status)}
              </div>

              {/* Items */}
              <div className="border-t pt-4 space-y-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.productImage || PLACEHOLDER}
                        onError={(e) =>
                          (e.currentTarget.src = PLACEHOLDER)
                        }
                        className="w-14 h-14 object-cover rounded border"
                        alt={item.productName}
                      />
                      <div>
                        <p className="font-medium">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.productSku}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{currency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary + Address */}
              <div className="grid sm:grid-cols-2 gap-6 mt-6 text-sm">
                <div>
                  <p className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{currency(subtotal)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{currency(shipping)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{currency(tax)}</span>
                  </p>
                  {discount > 0 && (
                    <p className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{currency(discount)}</span>
                    </p>
                  )}
                  <p className="flex justify-between font-semibold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{currency(total)}</span>
                  </p>
                  <p className="flex items-center gap-1 text-gray-500 mt-2">
                    <CreditCard size={14} />
                    {order.shiprocketPayload?.payment_type ??
                      "—"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Shipping</h4>
                  {shippingAddress ? (
                    <>
                      <p>
                        {shippingAddress.first_name}{" "}
                        {shippingAddress.last_name}
                      </p>
                      <p>{shippingAddress.line1}</p>
                      <p>
                        {shippingAddress.city},{" "}
                        {shippingAddress.state}{" "}
                        {shippingAddress.pincode}
                      </p>
                      <p>{shippingAddress.phone}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      No shipping address
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link to="/" className="text-blue-600 font-medium">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Order;
