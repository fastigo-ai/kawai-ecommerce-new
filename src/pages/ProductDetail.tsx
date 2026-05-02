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
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info,
  ChevronDown,
  ChevronUp
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Expansion states
  const [showFullShortDesc, setShowFullShortDesc] = useState(false);
  const [showFullLongDesc, setShowFullLongDesc] = useState(false);

  /* ---------------- FETCH & NORMALIZE ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductsId(id);
        const fetchedProduct = res?.product || res;
        
        // Normalize product data for the UI
        const normalizedProduct = {
          ...fetchedProduct,
          name: fetchedProduct.name || fetchedProduct.title,
          images: fetchedProduct.images || fetchedProduct.image?.map((img: any) => ({ imageUrl: img.src })),
          variants: fetchedProduct.variants?.map((v: any) => ({
            ...v,
            variantName: v.variantName || v.title,
            price: v.price,
            salePrice: v.salePrice || v.compare_at_price,
            images: v.images || v.image?.map((img: any) => ({ imageUrl: img.src }))
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

  /* ---------------- MEDIA GALLERY LOGIC ---------------- */
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

    addMedia(product?.video);
    addMedia(product?.videos);
    if (selectedVariant) {
      addMedia(selectedVariant.video);
      addMedia(selectedVariant.videos);
    }
    addMedia(product?.images);
    if (selectedVariant) {
      addMedia(selectedVariant.images);
    }

    const sorted = [
      ...items.filter(i => i.type === 'video'),
      ...items.filter(i => i.type === 'image')
    ];

    return sorted.length > 0 ? sorted : [{ type: 'image', url: FALLBACK_IMAGE }];
  }, [product, selectedVariant]);

  const price = selectedVariant?.salePrice ?? selectedVariant?.price ?? product?.salePrice ?? product?.price ?? 0;
  const originalPrice = selectedVariant?.price ?? product?.price ?? 0;
  const outOfStock = (selectedVariant?.stockQuantity ?? 0) <= 0;

  /* ---------------- HANDLERS ---------------- */
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant._id,
      productId: id!,
      name: product.name,
      price,
      image: media.find(m => m.type === 'image')?.url || FALLBACK_IMAGE,
      variantId: selectedVariant.shiprocketVariantId || product.shiprocketProductId,
      variantName: selectedVariant.variantName,
      sku: selectedVariant.sku || product.sku,
      shiprocketProductId: product.shiprocketProductId,
      shiprocketVariantId: selectedVariant.shiprocketVariantId || product.shiprocketProductId,
      quantity: qty
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
    } catch (err) { console.error(err); }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  /* ---------------- TRUNCATION HELPERS ---------------- */
  const truncateText = (text: string, limit: number) => {
    if (!text || text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const shortDesc = product?.shortDescription || "Delivering smiles in every box. This limited edition treasure is built to last through years of play and discovery.";
  const longDesc = product?.description || "Every Kawai World treasure is chosen for its quality and the joy it brings. We ensure all our toys and stationery meet international safety standards, using eco-friendly materials that are as soft as a cloud and as durable as your child's imagination.";

  /* ---------------- RENDER HELPERS ---------------- */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50/10">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full shadow-lg shadow-pink-100"
      />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen grid place-items-center bg-white px-4 text-center">
      <div className="space-y-8">
        <div className="text-[120px] filter drop-shadow-2xl animate-bounce">🧸</div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Oops! Treasure Not Found</h2>
          <p className="text-gray-400">It seems this magical item has vanished into thin air.</p>
        </div>
        <button 
          onClick={() => navigate("/")} 
          className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-[2rem] font-bold shadow-2xl hover:shadow-pink-200 transition-all hover:-translate-y-1"
        >
          Back to Magic Store
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 selection:bg-pink-100 selection:text-pink-600">
      <div className="fixed top-0 right-0 w-[40vw] h-[60vh] bg-gradient-to-bl from-pink-50/40 via-purple-50/20 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[40vh] bg-gradient-to-tr from-blue-50/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-gray-400 hover:text-pink-500 mb-8 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          Back to Collection
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* ----- LEFT: IMAGE/VIDEO GALLERY ----- */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-gray-50 rounded-[3rem] lg:rounded-[5rem] p-4 lg:p-12 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-8 border-white group"
            >
              <AnimatePresence mode="wait">
                {media[selectedMediaIndex]?.type === 'video' ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black shadow-inner"
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
                        className="w-full h-full object-contain"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedMediaIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="w-full h-full cursor-zoom-in relative"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                  >
                    <motion.img
                      src={media[selectedMediaIndex]?.url}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200"
                      style={{
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {media.length > 1 && (
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button 
                    onClick={() => setSelectedMediaIndex((prev) => (prev - 1 + media.length) % media.length)}
                    className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 transition-all active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setSelectedMediaIndex((prev) => (prev + 1) % media.length)}
                    className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 transition-all active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </motion.div>

            <div className="flex gap-5 justify-center overflow-x-auto no-scrollbar py-4 px-2">
              {media.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMediaIndex(i)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl overflow-hidden border-4 transition-all bg-gray-50 shadow-sm flex-shrink-0 ${selectedMediaIndex === i ? "border-pink-500 bg-white shadow-2xl scale-110 z-10" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full bg-gray-900">
                      <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play size={24} className="text-white fill-white" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} className="w-full h-full object-contain p-2" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ----- RIGHT: PRODUCT DETAILS ----- */}
          <div className="flex flex-col space-y-10 lg:space-y-14">
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] border border-pink-100/50 shadow-sm"
              >
                <Sparkles size={14} className="animate-pulse" />
                {product.categoryId?.name || "Kawai Collection"}
              </motion.div>

              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", damping: 12 }}
                  className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1] tracking-tighter"
                >
                  {product.name}
                </motion.h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-bold text-gray-900">4.9</span>
                  </div>
                  <div className="h-4 w-px bg-gray-100" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">128 Happy Kids</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-5">
                <span className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter drop-shadow-sm">₹{price}</span>
                {originalPrice > price && (
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl text-gray-300 line-through font-bold">₹{originalPrice}</span>
                    <span className="text-xs font-black text-green-500 uppercase">Save ₹{originalPrice - price}</span>
                  </div>
                )}
              </div>
              
              {/* Short Description with See More */}
              <div className="space-y-2">
                <p className="text-xl text-gray-500 leading-relaxed font-medium max-w-xl">
                  {showFullShortDesc ? shortDesc : truncateText(shortDesc, 120)}
                </p>
                {shortDesc.length > 120 && (
                  <button 
                    onClick={() => setShowFullShortDesc(!showFullShortDesc)}
                    className="flex items-center gap-1 text-pink-500 font-bold text-sm uppercase tracking-widest hover:text-pink-600 transition-colors"
                  >
                    {showFullShortDesc ? (
                      <>Show Less <ChevronUp size={14} /></>
                    ) : (
                      <>See More <ChevronDown size={14} /></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            {product.variants?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Select Style</label>
                  <span className="text-[10px] font-bold text-pink-500 uppercase">{selectedVariant?.variantName}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <motion.button
                      key={v._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedVariant(v); setSelectedMediaIndex(0); }}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${selectedVariant?._id === v._id
                          ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-100"
                          : "border-gray-100 bg-white text-gray-500 hover:border-pink-200"
                        }`}
                    >
                      {v.variantName}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                <div className="flex items-center bg-gray-50 rounded-[2rem] border border-gray-100 px-3 py-2 shadow-inner">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-pink-500 hover:shadow-sm transition-all"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </motion.button>
                  <span className="w-12 text-center font-black text-gray-900 text-2xl">{qty}</span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-pink-500 hover:shadow-sm transition-all"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </motion.button>
                </div>

                <motion.button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 flex items-center justify-center gap-4 px-10 py-6 rounded-[2rem] font-black text-white text-xl shadow-[0_20px_50px_-10px_rgba(236,72,153,0.4)] transition-all ${outOfStock ? "bg-gray-200 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600"
                    }`}
                >
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                </motion.button>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all font-bold text-gray-500"
                >
                  <Share2 size={18} />
                  Share Magic
                </button>
                <button className="w-16 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 hover:bg-pink-50 hover:text-pink-500 transition-all text-gray-400 group">
                  <Heart size={20} className="group-hover:fill-pink-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-10 border-t border-b border-gray-50">
              <div className="flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Flash Delivery</p>
                  <p className="text-[11px] text-gray-400 font-medium">Safe & Fast within 2-4 days</p>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Gold Standard</p>
                  <p className="text-[11px] text-gray-400 font-medium">100% Quality & Safety Tested</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex gap-12 border-b border-gray-50">
                {["story", "specs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-5 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-pink-500" : "text-gray-300 hover:text-gray-400"}`}
                  >
                    {tab === "story" ? "Product Story" : "Specifications"}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                  {activeTab === "story" ? (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Long Description with See More */}
                      <div className="space-y-4">
                        <p className="text-lg text-gray-500 leading-relaxed font-normal">
                          {showFullLongDesc ? longDesc : truncateText(longDesc, 200)}
                        </p>
                        {longDesc.length > 200 && (
                          <button 
                            onClick={() => setShowFullLongDesc(!showFullLongDesc)}
                            className="flex items-center gap-1 text-pink-500 font-bold text-sm uppercase tracking-widest hover:text-pink-600 transition-colors"
                          >
                            {showFullLongDesc ? (
                              <>Show Less <ChevronUp size={14} /></>
                            ) : (
                              <>See More <ChevronDown size={14} /></>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {["Eco-Friendly", "Non-Toxic", "Premium Quality"].map((tag) => (
                          <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-green-500" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
                    >
                      {[
                        { icon: Ruler, label: "Length", value: `${selectedVariant?.length || product?.length || "--"} cm`, color: "bg-pink-50 text-pink-500" },
                        { icon: Maximize, label: "Height", value: `${selectedVariant?.height || product?.height || "--"} cm`, color: "bg-purple-50 text-purple-500" },
                        { icon: WeightIcon, label: "Weight", value: `${selectedVariant?.weight || product?.weight || "--"} kg`, color: "bg-blue-50 text-blue-500" },
                        { icon: Info, label: "SKU", value: selectedVariant?.sku || product?.sku || "--", color: "bg-orange-50 text-orange-500" },
                      ].map((spec, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex items-center gap-6 group hover:bg-white transition-colors">
                          <div className={`w-14 h-14 rounded-2xl ${spec.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <spec.icon size={24} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
                            <p className="text-lg font-black text-gray-900 tracking-tight">{spec.value}</p>
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
    </div>
  );
};

export default ProductDetail; 