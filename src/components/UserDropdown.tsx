import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, LogOut, ShoppingBag } from "lucide-react";

const UserDropdown = ({
  isOpen,
  onClose,
  isAuthenticated,
  onSignInClick,
  onLogout,
  user,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute right-0 mt-[10px] w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex flex-col py-2 text-sm">
            {isAuthenticated ? (
              <>
                {/* ✅ Only show if user and user._id exist */}
               
                {user.data?._id && (
                  <Link
                    to={`/order/${user.data._id}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-foreground transition"
                    onClick={onClose}
                  >
                    <ShoppingBag size={18} />
                    My Orders
                  </Link>
                )}

                <button
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-left text-foreground transition"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-left text-foreground transition"
                onClick={() => {
                  onSignInClick();
                  onClose();
                }}
              >
                <User size={18} />
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDropdown;
