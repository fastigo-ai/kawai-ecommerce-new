import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, index, viewMode = "grid" }) => {
  const navigate = useNavigate();

  const variant = product?.variants?.[0];

  const imageSrc =
    variant?.image?.[0]?.src ||
    variant?.images?.[0]?.imageUrl ||
    product?.image?.[0]?.src ||
    product?.images?.[0]?.imageUrl ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const originalPrice = Number(product?.price || variant?.price) || 0;
  const salePrice = Number(product?.salePrice || variant?.compare_at_price || variant?.salePrice) || 0;
  const hasDiscount = salePrice > 0 && salePrice < originalPrice;

  const productName = product?.name || product?.title;

  const goToProduct = () => {
    navigate(`/product/${product?.id}`);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-6 p-4 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
      >
        <div 
          className="w-40 h-40 bg-gray-50 rounded-2xl overflow-hidden shrink-0 cursor-pointer"
          onClick={goToProduct}
        >
          <img src={imageSrc} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt={productName} />
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-2">
           <div className="space-y-2">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{product?.categoryName || "Premium"}</span>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-500 transition-colors cursor-pointer" onClick={goToProduct}>{productName}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{(product?.description || product?.body_html)?.replace(/<[^>]*>?/gm, '')}</p>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">₹{hasDiscount ? salePrice : originalPrice}</span>
                {hasDiscount && <span className="text-sm line-through text-gray-400">₹{originalPrice}</span>}
              </div>
              <button 
                onClick={goToProduct}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-pink-500 transition-all flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                View Details
              </button>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl sm:rounded-[2rem] p-2 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-500 border border-white/50"
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-20">
          <div className="bg-pink-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-lg transform -rotate-12">
            -{Math.round(((originalPrice - Number(salePrice)) / originalPrice) * 100)}%
          </div>
        </div>
      )}

      {/* Image Container */}
      <div 
        className="relative aspect-[1/1] sm:aspect-[4/5] rounded-lg sm:rounded-[1.5rem] overflow-hidden cursor-pointer bg-gradient-to-br from-gray-50 to-pink-50/30"
        onClick={goToProduct}
      >
        <motion.img
          src={imageSrc}
          alt={productName}
          className="w-full h-full object-contain p-2 sm:p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />

        {/* Action Overlay (Hidden on Mobile) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:flex items-end justify-center pb-6">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl text-gray-900 font-bold text-sm"
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
          >
            <Eye size={16} className="text-pink-500" />
            Quick View
          </motion.button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-2 sm:mt-6 space-y-1 sm:space-y-3 px-0.5 sm:px-1">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5 sm:space-y-1">
             <span className="hidden sm:inline-block text-[8px] sm:text-[10px] font-bold text-pink-400 uppercase tracking-widest">
              {product?.categoryName || "Premium"}
            </span>
            <h3 className="font-bold text-gray-900 text-[10px] sm:text-lg leading-tight line-clamp-1 group-hover:text-pink-600 transition-colors">
              {productName}
            </h3>
          </div>
        </div>

        <div className="flex flex-col pt-1 sm:pt-2 border-t border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-4">
            <div className="flex flex-col">
              <span className="text-[12px] sm:text-2xl font-bold text-gray-900">
                ₹{hasDiscount ? salePrice : originalPrice}
              </span>
              {hasDiscount && (
                <span className="text-[8px] sm:text-xs line-through text-gray-400 font-medium">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 sm:py-4 rounded-lg sm:rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 text-white font-bold text-[8px] sm:text-xs uppercase tracking-tight sm:tracking-[0.2em] shadow-lg shadow-pink-100 transition-all hover:shadow-pink-200 flex items-center justify-center gap-1 sm:gap-2"
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
          >
            <ShoppingCart size={10} className="sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Buy Now</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
