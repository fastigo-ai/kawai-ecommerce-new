import { motion } from "framer-motion";
import { Plus, Minus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ShiprocketCheckoutButton from "../components/ShiprocketCheckoutButton";

const CartPage = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () =>
    state.items.reduce((acc, item) => {
      const unit =
        typeof item.salePrice === "number" && item.salePrice < item.price
          ? item.salePrice
          : item.price;
      return acc + unit * item.quantity;
    }, 0);

  const getItemImage = (item) =>
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images[0]) ||
    "https://via.placeholder.com/150";

  if (state.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven’t added anything yet
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="text-primary" />
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item, index) => {
            const unit =
              typeof item.salePrice === "number" && item.salePrice < item.price
                ? item.salePrice
                : item.price;

            return (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 bg-white rounded-2xl border shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  navigate(`/product/${item.productId}`);
                  closeCart();
                }}
              >
                {/* IMAGE */}
                <div className="w-24 h-24 rounded-xl overflow-hidden border bg-white">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.name}
                  </h3>

                  {item.selectedColor && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Variant: {item.selectedColor}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-primary font-bold">
                      ₹{unit.toFixed(0)}
                    </span>
                    {item.salePrice && (
                      <span className="text-xs line-through text-muted-foreground">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeItem({
                      id: item.id,
                      variantId: item.variantId,
                      selectedColor: item.selectedColor,
                    })
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span className="text-primary">₹{state.total.toFixed(2)}</span>
          </div>

          <ShiprocketCheckoutButton />

          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure checkout • Powered by Shiprocket
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
