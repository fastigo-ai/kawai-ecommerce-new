import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  Maximize,
  Weight as WeightIcon,
  Ruler,
  Play
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";
import { getProductsId } from "../APi/api";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductsId(id);
        const fetchedProduct = res?.product || res;
        
        // Normalize product data for the UI
        const normalizedProduct = {
          ...fetchedProduct,
          name: fetchedProduct.title || fetchedProduct.name,
          images: fetchedProduct.image?.map(img => ({ imageUrl: img.src })) || fetchedProduct.images,
          variants: fetchedProduct.variants?.map(v => ({
            ...v,
            variantName: v.title || v.variantName,
            price: v.price,
            salePrice: v.compare_at_price,
            images: v.image?.map(img => ({ imageUrl: img.src })) || v.images
          }))
        };

        setProduct(normalizedProduct);
        if (normalizedProduct.variants?.length > 0) {
          setSelectedVariant(normalizedProduct.variants[0]);
        }
      } catch {
        toast({ title: "Product not found", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const media = useMemo(() => {
    const items = [];
    const seenUrls = new Set();

    const isVideo = (url) => {
      if (!url || typeof url !== 'string') return false;
      return url.match(/\.(mp4|webm|ogg|mov)$|youtube\.com|youtu\.be|vimeo\.com/i);
    };

    const addMedia = (list) => {
      if (!list) return;
      const normalizedList = Array.isArray(list) ? list : [list];

      normalizedList.forEach(item => {
        const url = typeof item === 'string' ? item : (item.imageUrl || item.videoUrl || item.url || item.video || item);
        if (url && !seenUrls.has(url)) {
          items.push({
            type: isVideo(url) ? 'video' : 'image',
            url,
            isEmbed: url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
          });
          seenUrls.add(url);
        }
      });
    };

    // 1. Collect all potential media from Variant and Product
    // Priority: Product Videos -> Variant Videos -> Product Images -> Variant Images
    addMedia(product?.videos);
    addMedia(product?.video);
    if (selectedVariant) {
      addMedia(selectedVariant.videos);
      addMedia(selectedVariant.video);
    }
    addMedia(product?.images);
    if (selectedVariant) {
      addMedia(selectedVariant.images);
    }

    // 2. Sort so videos come first
    const sorted = [
      ...items.filter(i => i.type === 'video'),
      ...items.filter(i => i.type === 'image')
    ];

    return sorted.length > 0 ? sorted : [{ type: 'image', url: FALLBACK_IMAGE }];
  }, [product, selectedVariant]);

  const price = selectedVariant?.salePrice ?? selectedVariant?.price ?? product?.salePrice ?? product?.price;
  const originalPrice = selectedVariant?.price ?? product?.price;
  const outOfStock = selectedVariant?.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant._id,
      productId: product.shiprocketProductId,
      name: product.name,
      price,
      image: media.find(m => m.type === 'image')?.url || FALLBACK_IMAGE,
      variantId: selectedVariant.shiprocketVariantId,
      variantName: selectedVariant.variantName,
      sku: selectedVariant.sku,
      quantity: qty
    });
    toast({
      title: "Added to cart! 🛍️",
      description: `${product.name} ready for checkout.`,
    });
    openCart();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50/20">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen grid place-items-center bg-white px-4 text-center">
      <div className="space-y-6">
        <div className="text-8xl">🧸</div>
        <h2 className="text-3xl font-bold text-gray-900">Oops! Product not found.</h2>
        <button onClick={() => navigate("/")} className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-bold shadow-xl">Back to Magic Store</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[600px] bg-gradient-to-l from-pink-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        {/* Navigation Breadcrumb-like Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-4 transition-colors font-medium text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-100/50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Collection
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ----- IMAGE/VIDEO GALLERY ----- */}
          <div className="space-y-6 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group aspect-square bg-gray-50 rounded-[2.5rem] lg:rounded-[4rem] p-4 lg:p-8 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white"
            >
              <AnimatePresence mode="wait">
                {media[selectedMediaIndex]?.type === 'video' ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full rounded-[2rem] overflow-hidden"
                  >
                    {media[selectedMediaIndex].isEmbed ? (
                      <iframe
                        src={media[selectedMediaIndex].url.replace('watch?v=', 'embed/')}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={media[selectedMediaIndex].url}
                        className="w-full h-full object-contain bg-black/90"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.img
                    key={selectedMediaIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    src={media[selectedMediaIndex]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-4 justify-center overflow-x-auto no-scrollbar py-2">
              {media.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMediaIndex(i)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl overflow-hidden border-3 transition-all p-1 bg-gray-50 ${selectedMediaIndex === i ? "border-pink-500 bg-white shadow-xl" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play size={20} className="text-white fill-white" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} className="w-full h-full object-contain" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ----- PRODUCT INFO ----- */}
          <div className="flex flex-col space-y-8 lg:space-y-12 pt-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold uppercase tracking-widest border border-pink-200"
              >
                <Sparkles size={12} />
                {product.categoryId?.name || "Featured Treasure"}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight"
              >
                {product.name}
              </motion.h1>

              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-sm font-medium text-gray-400">(48 verified reviews)</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tighter">₹{price}</span>
                {originalPrice > price && (
                  <span className="text-xl lg:text-2xl text-gray-300 line-through font-medium">₹{originalPrice}</span>
                )}
                <div className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold border border-green-200">
                  SAVE {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </div>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed font-normal max-w-xl">
                {product.shortDescription || "Crafted with love and magic, this premium gift is designed to spark endless imagination and create unforgettable childhood memories."}
              </p>
            </motion.div>

            {/* VARIANT SELECTOR */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest">Select Style</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => { setSelectedVariant(v); setSelectedMediaIndex(0); }}
                      className={`group flex items-center gap-3 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl text-sm font-bold transition-all border-2 ${selectedVariant?._id === v._id
                          ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-200"
                          : "border-gray-100 bg-white text-gray-600 hover:border-pink-200"
                        }`}
                    >
                      {/* Variant Mini Image */}
                      {v.images?.[0]?.imageUrl && (
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-50 border border-white/20">
                          <img src={v.images[0].imageUrl} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {v.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION SECTION */}
            <div className="space-y-8 pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 px-2 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-xl">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <motion.button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-2xl transition-all ${outOfStock ? "bg-gray-200 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:shadow-pink-200"
                    }`}
                >
                  <ShoppingCart size={22} />
                  {outOfStock ? "Sold Out 🧸" : "Add to Cart"}
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 py-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Secured Shipping</p>
                    <p className="text-[10px] text-gray-400">Arrives in 3-5 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Safety Tested</p>
                    <p className="text-[10px] text-gray-400">100% Kid-Safe Material</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION TABS */}
            <div className="space-y-6">
              <div className="flex gap-8 border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "story" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-300 hover:text-gray-500"
                    }`}
                >
                  Story & Details
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "specs" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-300 hover:text-gray-500"
                    }`}
                >
                  Specifications
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "story" ? (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <p className="text-gray-500 leading-relaxed font-normal">
                      {product.description || "Every Kawai World treasure is chosen for its quality and the joy it brings. We ensure all our toys and stationery meet international safety standards, using eco-friendly materials that are as soft as a cloud and as durable as your child's imagination."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
                        <Ruler size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Length</p>
                        <p className="text-sm font-bold text-gray-900">{selectedVariant?.length || "--"} cm</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center">
                        <Maximize size={20} className="rotate-90" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Height</p>
                        <p className="text-sm font-bold text-gray-900">{selectedVariant?.height || "--"} cm</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
                        <WeightIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weight</p>
                        <p className="text-sm font-bold text-gray-900">{selectedVariant?.weight || "--"} kg</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</p>
                        <p className="text-sm font-bold text-gray-900">{selectedVariant?.sku || "--"}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
