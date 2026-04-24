import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Logo from "../assest/logoA.png";
import { loginUser } from "../APi/api";

const SignInModal = ({ isOpen, onClose, onSignIn }) => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Debug props (optional)
  console.log("SignInModal Props:", { isOpen, onClose, onSignIn });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(mobile, dispatch);

      // **Safety Check**
      if (typeof onSignIn === "function") {
        onSignIn(user);
      } else {
        console.error("❌ onSignIn is NOT a function");
      }

      if (typeof onClose === "function") {
        onClose();
      }
      window.location.reload();

    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-card p-8 rounded-[2rem] shadow-2xl w-full max-w-sm mx-auto relative border border-white/20"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="p-3 bg-pink-50 rounded-3xl">
                <img src={Logo} alt="Company Logo" className="h-20 w-auto" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#7A6A9C] to-[#BBA0D4] text-transparent bg-clip-text mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-400 font-medium">Sign in to your magical account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  required
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                  }
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-sm outline-none focus:border-pink-300 transition-all bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-pink-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : "Sign In ✨"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;
