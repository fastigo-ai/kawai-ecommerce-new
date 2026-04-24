import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { getStoreProducts } from "../APi/api.js";
import { toast } from "../hooks/use-toast";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getStoreProducts({ limit: 6 });
        // Correctly map the nested data from your API
        const productData = res?.data?.products || res?.products || [];
        setProducts(productData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
        toast({
          title: "Error fetching products",
          description: err.message || "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShowAll = () => {
    navigate("/category/all");
  };

  /* ---------------- LOADING STATE ---------------- */
  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#FFF1F9] via-[#F8E8FF] to-[#EAF6FF] relative overflow-hidden">
        {/* Background Blobs */}
        <motion.div
          className="absolute top-20 left-10 w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-purple-300/20 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative flex flex-col justify-center items-center h-80 space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-pink-500" />
          </motion.div>
          <motion.p
            className="text-xl font-bold text-purple-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading magical products...
          </motion.p>
        </div>
      </section>
    );
  }

  /* ---------------- ERROR STATE ---------------- */
  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#FFF1F9] via-[#F8E8FF] to-[#EAF6FF]">
        <div className="flex flex-col justify-center items-center h-80 space-y-4">
          <div className="text-6xl">😢</div>
          <p className="text-xl font-bold text-red-500">Oops! Something went wrong</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#FFF1F9] via-[#F8E8FF] to-[#EAF6FF] overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-purple-300/20 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[280px] h-[280px] bg-blue-200/15 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-pink-400/40 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2.5 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* -------- Elite Header -------- */}
        <motion.div
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-xl shadow-xl border border-pink-100"
          >
            <Sparkles className="text-pink-500" size={18} />
            <span className="text-pink-600 font-black text-[10px] uppercase tracking-[0.2em]">
              Handpicked Just For You
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
            Featured Products ⭐
          </h2>

          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Magical treasures that kids love and parents trust!
          </p>

          <div className="flex justify-center">
            <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
          </div>
        </motion.div>

        {/* -------- Product Grid -------- */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>

        {/* -------- Explore All Button -------- */}
        {products.length >= 6 && (
          <motion.div
            className="flex justify-center mt-12 lg:mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button
              onClick={handleShowAll}
              className="group relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold text-base sm:text-lg shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10">Explore All Products</span>
              <ArrowRight
                size={20}
                className="relative z-10 group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </motion.div>
        )}

        {/* -------- Decorative Elements (One Row on Mobile) -------- */}
        <div className="mt-12 lg:mt-20 flex flex-row overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:justify-center gap-3 sm:gap-8 pb-4">
          {[
            { icon: "🎁", text: "Free Gift Wrap" },
            { icon: "🚚", text: "Fast Shipping" },
            { icon: "💝", text: "Gift Ready" },
            { icon: "✨", text: "Premium Quality" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
              className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg whitespace-nowrap min-w-fit border border-white/50"
            >
              <span className="text-lg sm:text-2xl">{item.icon}</span>
              <span className="text-[10px] sm:text-sm font-semibold text-gray-700">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;