import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import { useShiprocketScript } from "../hooks/useShiprocketScript";
import SignInModal from "../components/SignInModal";
import { motion } from "framer-motion";
import { createShiprocketCheckout } from "../APi/api";

declare global {
  interface Window {
    HeadlessCheckout: {
      addToCart: (event: Event, token: string) => void;
    };
  }
}

export default function ShiprocketCheckoutButton() {
  const { state } = useCart();
  const user = useSelector(selectUser);
  const isAuthenticated = Boolean(user?.data?._id);
  const isReady = useShiprocketScript();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------------- HANDLER ---------------- */

  const handleCheckout = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // ❌ Not logged in → open sign-in modal
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    if (!isReady) {
      alert("Checkout is still loading. Please wait.");
      return;
    }

    if (state.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const items = state.items.map((item) => ({
      id: String(item.variantId), // Shiprocket variant_id
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      sku: item.sku,
      productId: item.productId,
      productImage: item.image,
    }));

    const redirectUrl = `${window.location.origin}/order/success?userId=${user.data._id}`;

    setLoading(true);
    try {
      const data = await createShiprocketCheckout({
        items,
        redirectUrl,
        userId: user.data._id
      });

      setLoading(false);

      const token = data?.result?.result?.token;

      if (!token) {
        console.error("Invalid checkout response:", data);
        alert("Unable to start checkout. Please try again.");
        return;
      }

      // 🚀 Launch Shiprocket checkout
      window.HeadlessCheckout.addToCart(
        event.nativeEvent,
        token
      );
    } catch (error: any) {
      // 🔐 Session expired
      if (error.response?.status === 401) {
        setIsModalOpen(true);
      } else {
        console.error("Checkout error:", error);
        alert("Checkout failed. Please try again.");
      }
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleCheckout}
        disabled={loading || !isReady}
        className="w-full bg-gradient-to-r from-[#7a6a9b] to-[#4d04df] text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-60"
      >
        {loading ? "Starting Checkout..." : "Checkout Securely 🚀"}
      </motion.button>

      {/* 🔐 SIGN IN MODAL */}
      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignIn={() => {
          setIsModalOpen(false);
          // No reload needed if Redux updates correctly
        }}
      />
    </>
  );
}
