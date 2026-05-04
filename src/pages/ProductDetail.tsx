import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Plus,
  Minus,
  Maximize,
  Weight as WeightIcon,
  Ruler,
  Play,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";
import { getProductsId } from "../APi/api";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("story");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isShortDescExpanded, setIsShortDescExpanded] = useState(false);

  // References for navigation
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Zoom state (from original)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

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
          images: fetchedProduct.image?.map((img: any) => ({ imageUrl: img.src })) || fetchedProduct.images,
          variants: fetchedProduct.variants?.map((v: any) => ({
            ...v,
            variantName: v.title || v.variantName,
            price: v.price,
            salePrice: v.compare_at_price,
            images: v.image?.map((img: any) => ({ imageUrl: img.src })) || v.images
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
    const items: any[] = [];
    const seenUrls = new Set();

    const isVideo = (url: string) => {
      if (!url || typeof url !== 'string') return false;
      return url.match(/\.(mp4|webm|ogg|mov)$|youtube\.com|youtu\.be|vimeo\.com/i);
    };

    const addMedia = (list: any) => {
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

  const price = selectedVariant?.salePrice ?? selectedVariant?.price ?? product?.salePrice ?? product?.price ?? 0;
  const originalPrice = selectedVariant?.price ?? product?.price ?? 0;
  const outOfStock = (selectedVariant?.stockQuantity ?? 0) <= 0;

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = 240;
      thumbnailRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      quantity: qty,
      shiprocketProductId: product.shiprocketProductId,
      shiprocketVariantId: selectedVariant.shiprocketVariantId,
    });
    toast({
      title: "Added to cart! 🛍️",
      description: `${product.name} ready for checkout.`,
    });
    openCart();
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name} for ₹${price}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Product link copied to clipboard" });
      }
    } catch (err) {
      console.log(err);
    }
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
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[600px] bg-gradient-to-l from-pink-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        {/* Navigation Breadcrumb-like Back */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors font-medium text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-100/50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Collection
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all shadow-sm"
          >
            <Share2 size={20} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* IMAGE / VIDEO SECTION (REVERTED) */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="relative bg-white rounded-3xl p-6 shadow-sm overflow-hidden border border-gray-100">
              {media[selectedMediaIndex]?.type === "image" ? (
                <div 
                  className="w-full h-[420px] overflow-hidden cursor-zoom-in relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  <motion.img
                    src={media[selectedMediaIndex]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-[420px] bg-black/90 rounded-2xl overflow-hidden">
                  {media[selectedMediaIndex]?.isEmbed ? (
                    <iframe
                      src={media[selectedMediaIndex].url.replace('watch?v=', 'embed/')}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={media[selectedMediaIndex]?.url}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}

              {media.length > 1 && (
                <>
                  <ChevronLeft
                    className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/80 rounded-full p-1 shadow-md hover:bg-white z-10"
                    size={32}
                    onClick={() =>
                      setSelectedMediaIndex(
                        (selectedMediaIndex - 1 + media.length) % media.length
                      )
                    }
                  />
                  <ChevronRight
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/80 rounded-full p-1 shadow-md hover:bg-white z-10"
                    size={32}
                    onClick={() =>
                      setSelectedMediaIndex(
                        (selectedMediaIndex + 1) % media.length
                      )
                    }
                  />
                </>
              )}
            </div>

            {/* THUMBNAILS WITH NAVIGATION */}
            <div className="relative group mt-8">
              {media.length > 1 && (
                <>
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 shadow-xl rounded-full p-3 hover:bg-white transition-all flex items-center justify-center border border-gray-100 -ml-2 group-hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft size={20} className="text-pink-500" />
                  </button>
                  <button
                    onClick={() => scrollThumbnails("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 shadow-xl rounded-full p-3 hover:bg-white transition-all flex items-center justify-center border border-gray-100 -mr-2 group-hover:scale-110 active:scale-95"
                  >
                    <ChevronRight size={20} className="text-pink-500" />
                  </button>
                </>
              )}

              <div 
                ref={thumbnailRef}
                className="flex gap-4 overflow-x-auto no-scrollbar py-4 scroll-smooth snap-x items-center justify-start px-2"
                style={{ scrollPadding: '0 24px' }}
              >
                {media.map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMediaIndex(i)}
                    className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl overflow-hidden border-2 transition-all flex-shrink-0 snap-center bg-white shadow-sm ${
                      selectedMediaIndex === i 
                        ? "border-pink-500 shadow-xl shadow-pink-100 ring-4 ring-pink-50" 
                        : "border-gray-50 opacity-70 hover:opacity-100 hover:shadow-md"
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="relative w-full h-full rounded-[1.4rem] overflow-hidden bg-gray-900 group/vid">
                        {!item.isEmbed ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover opacity-80"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                            <Play size={24} className="text-pink-500 fill-pink-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover/vid:bg-black/20 transition-colors">
                          <Play size={20} className="text-white fill-white scale-100 group-hover/vid:scale-110 transition-transform" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded uppercase font-black tracking-tighter scale-75">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ----- PRODUCT INFO ----- */}
          <div className="flex flex-col space-y-8 lg:space-y-12 pt-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 text-[10px] font-bold uppercase tracking-widest border border-pink-100"
              >
                <Sparkles size={12} />
                {product.categoryId?.name || "Featured Treasure"}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight"
              >
                {product.name}
              </motion.h1>

            
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter">₹{price}</span>
                {originalPrice > price && (
                  <span className="text-2xl lg:text-3xl text-gray-200 line-through font-bold">₹{originalPrice}</span>
                )}
                <div className="px-3 py-1 bg-green-50 text-green-500 rounded-xl text-xs font-black border border-green-100">
                  SAVE {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </div>
              </div>
              <div className="text-lg text-gray-500 leading-relaxed font-normal max-w-xl">
                {isShortDescExpanded 
                  ? (product.shortDescription || "Crafted with love and magic, this premium gift is designed to spark endless imagination and create unforgettable childhood memories.")
                  : `${(product.shortDescription || "Crafted with love and magic, this premium gift is designed to spark endless imagination and create unforgettable childhood memories.").slice(0, 120)}${(product.shortDescription?.length > 120 || !product.shortDescription) ? '...' : ''}`
                }
                {(product.shortDescription?.length > 120 || !product.shortDescription) && (
                  <button 
                    onClick={() => setIsShortDescExpanded(!isShortDescExpanded)}
                    className="text-pink-500 font-bold ml-2 hover:text-pink-600 transition-colors inline-flex items-center gap-0.5"
                  >
                    {isShortDescExpanded ? 'See Less' : 'See More'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* VARIANT SELECTOR */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest">Select Style</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v._id}
                      onClick={() => { setSelectedVariant(v); setSelectedMediaIndex(0); }}
                      className={`group flex items-center gap-3 px-4 py-2 lg:px-6 lg:py-3 rounded-[1.5rem] text-sm font-bold transition-all border-2 ${selectedVariant?._id === v._id
                          ? "border-pink-500 bg-pink-500 text-white shadow-xl shadow-pink-100"
                          : "border-gray-100 bg-white text-gray-500 hover:border-pink-200 hover:text-pink-500"
                        }`}
                    >
                      {v.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION SECTION */}
            <div className="space-y-8 pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex items-center bg-gray-50 rounded-[1.5rem] border border-gray-100 px-2 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-black text-gray-900 text-2xl">{qty}</span>
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
                  className={`flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] font-black text-white text-xl shadow-2xl transition-all ${outOfStock ? "bg-gray-200 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:shadow-pink-200/50"
                    }`}
                >
                  <ShoppingCart size={24} />
                  {outOfStock ? "Sold Out 🧸" : "Add to Cart"}
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 py-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Truck size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Secured Shipping</p>
                    <p className="text-[10px] text-gray-400 font-medium">Arrives in 3-5 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Safety Tested</p>
                    <p className="text-[10px] text-gray-400 font-medium">100% Kid-Safe Material</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION TABS */}
            <div className="space-y-8">
              <div className="flex gap-10 border-b border-gray-100">
                {["story", "specs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? "text-pink-500" : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    {tab === "story" ? "Story & Details" : "Specifications"}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" 
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "story" ? (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-lg text-gray-500 leading-relaxed font-normal">
                        {isDescExpanded 
                          ? (product.description || "Every Kawai World treasure is chosen for its quality and the joy it brings. We ensure all our toys and stationery meet international safety standards, using eco-friendly materials that are as soft as a cloud and as durable as your child's imagination.")
                          : `${(product.description || "Every Kawai World treasure is chosen for its quality and the joy it brings. We ensure all our toys and stationery meet international safety standards, using eco-friendly materials that are as soft as a cloud and as durable as your child's imagination.").slice(0, 180)}...`
                        }
                      </p>
                      {(product.description?.length > 180 || !product.description) && (
                        <button 
                          onClick={() => setIsDescExpanded(!isDescExpanded)}
                          className="text-pink-500 font-black text-xs uppercase tracking-widest mt-4 hover:text-pink-600 transition-all flex items-center gap-1 border-b-2 border-pink-100 pb-0.5"
                        >
                          {isDescExpanded ? 'See Less' : 'See More'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {[
                      { label: "Length", value: selectedVariant?.length, icon: Ruler, color: "bg-pink-50 text-pink-500" },
                      { label: "Height", value: selectedVariant?.height, icon: Maximize, color: "bg-purple-50 text-purple-500", extra: "rotate-90" },
                      { label: "Weight", value: selectedVariant?.weight, icon: WeightIcon, color: "bg-blue-50 text-blue-500" },
                      { label: "SKU", value: selectedVariant?.sku, icon: Sparkles, color: "bg-orange-50 text-orange-500" },
                    ].map((spec, idx) => (
                      <div key={idx} className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl ${spec.color} flex items-center justify-center shadow-sm`}>
                          <spec.icon size={22} className={spec.extra} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
                          <p className="text-base font-black text-gray-900">
                            {spec.label === "Weight" 
                              ? `${spec.value ? (Number(spec.value) * 1000) : "--"} g` 
                              : (spec.label === "SKU" ? (spec.value || "--") : `${spec.value || "--"} cm`)
                            }
                          </p>
                        </div>
                      </div>
                    ))}
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
