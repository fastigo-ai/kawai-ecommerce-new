import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
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

  const getItemImage = (item: any) =>
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
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.1)] border-l border-pink-50"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-pink-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shadow-sm">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-none">Your Cart</h2>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mt-1">
                      {state.items.length} {state.items.length === 1 ? "Treasure" : "Treasures"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
                {state.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="text-8xl animate-bounce">🛍️</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900">
                        Cart is Empty
                      </h3>
                      <p className="text-sm text-gray-400 max-w-[200px]">
                        Looks like you haven't added any magic yet ✨
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="px-8 py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-100 hover:scale-105 active:scale-95 transition-all"
                    >
                      Start Shopping
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
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative group flex gap-4 p-4 rounded-3xl bg-white border border-gray-50 hover:border-pink-100 transition-all shadow-sm hover:shadow-xl hover:shadow-pink-50/50"
                      >
                        {/* Image */}
                        <div 
                          className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            navigate(`/product/${item.productId}`);
                            closeCart();
                          }}
                        >
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight pr-6">
                              {item.name}
                            </h4>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                              {item.variantName || "Default"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-pink-500">
                                ₹{unit.toFixed(0)}
                              </span>
                              {item.salePrice && item.salePrice < item.price && (
                                <span className="text-xs font-bold text-gray-300 line-through">
                                  ₹{item.price}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 rounded-xl px-1.5 py-1 gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(
                                    item.id,
                                    Math.max(0, item.quantity - 1),
                                    { variantId: item.variantId, selectedColor: item.selectedColor }
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-white text-gray-400 hover:text-pink-500 shadow-sm flex items-center justify-center transition-all active:scale-90"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="text-sm font-black text-gray-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(
                                    item.id, 
                                    item.quantity + 1,
                                    { variantId: item.variantId, selectedColor: item.selectedColor }
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-pink-500 text-white shadow-sm flex items-center justify-center transition-all active:scale-90"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button Overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem({
                              id: item.id,
                              variantId: item.variantId,
                              selectedColor: item.selectedColor,
                            });
                          }}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-pink-50 px-8 py-8 space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                      <span className="text-sm font-bold">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900">Total Order</span>
                      <span className="text-3xl font-black text-pink-500 tracking-tighter">
                        ₹{state.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleViewCart}
                      className="group w-full py-4 rounded-[1.5rem] bg-gray-50 text-gray-600 font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      View Full Cart
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <ShiprocketCheckoutButton />
                  </div>

                  <p className="text-[10px] font-bold text-center text-gray-300 uppercase tracking-widest">
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
