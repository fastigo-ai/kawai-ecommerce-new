import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import { useState } from "react";
import SignInModal from "./SignInModal";
import ShiprocketCheckoutButton from "./ShiprocketCheckoutButton";

const CartSidebar = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);

  const calculateSubtotal = () =>
    state.items.reduce((acc, item) => {
      const unit =
        typeof item.salePrice === "number" && item.salePrice < item.price
          ? item.salePrice
          : item.price;
      return acc + unit * item.quantity;
    }, 0);

  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  const getItemImage = (item) =>
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images[0]) ||
    "https://via.placeholder.com/150";

  const handleViewCart = () => {
    closeCart();
    navigate("/cart");
  };

  return (
    <>
      <AnimatePresence>
        {state.isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-50 flex flex-col shadow-2xl"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">My Cart</h2>
                    <p className="text-xs text-muted-foreground">
                      {state.items.length} item{state.items.length !== 1 && "s"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-muted transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {state.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">🛍️</div>
                    <h3 className="text-lg font-semibold mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add something you love ✨
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:opacity-90"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  state.items.map((item, index) => {
                    const unit =
                      typeof item.salePrice === "number" &&
                      item.salePrice < item.price
                        ? item.salePrice
                        : item.price;

                    return (
                      <motion.div
                        key={`${item.id}-${index}`}
                        className="flex gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/40 transition cursor-pointer shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          navigate(`/product/${item.productId}`);
                          closeCart();
                        }}
                      >
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border">
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-2">
                            {item.name}
                          </h4>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-primary font-bold">
                              ₹{unit.toFixed(0)}
                            </span>
                            {item.salePrice && (
                              <span className="text-xs line-through text-muted-foreground">
                                ₹{item.price}
                              </span>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
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
                          <X size={16} />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t px-6 py-5 space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary text-[#9a68f9]">
                      ₹{state.total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleViewCart}
                    className="w-full py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary bg-gradient-to-r from-[#7a6a9b] to-[#4d04df] text-white hover:text-white transition"
                  >
                    View Full Cart
                  </button>

                  <ShiprocketCheckoutButton />

                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout • Powered by Shiprocket
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSignIn={() => {
          setSignInModalOpen(false);
          navigate("/checkout");
        }}
      />
    </>
  );
};

export default CartSidebar;
