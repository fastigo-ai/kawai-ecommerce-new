import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";
import { getProductsId } from "../APi/api";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x600?text=No+Image";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductsId(id);
        const data = res.product ?? res;

        setProduct(data);
        setSelectedVariant(data.variants?.[0] || null);
      } catch {
        toast({
          title: "Product not found",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------------- MEDIA (IMAGES + VIDEOS) ---------------- */
  const media = useMemo(() => {
    const variantImages = selectedVariant?.images || [];
    const productImages = product?.images || [];
    const videos = product?.video || [];

    // ✅ Merge all images
    const allImages = [...variantImages, ...productImages];

    // ✅ Remove duplicates
    const uniqueImages = allImages.filter(
      (img, index, self) =>
        index === self.findIndex(i => i.imageUrl === img.imageUrl)
    );

    const formattedImages = uniqueImages.map((img: any) => ({
      type: "image",
      url: img.imageUrl,
    }));

    const formattedVideos = videos.map((vid: any) => ({
      type: "video",
      url: vid.videoUrl,
    }));

    const combined = [...formattedImages, ...formattedVideos];

    return combined.length > 0
      ? combined
      : [{ type: "image", url: FALLBACK_IMAGE }];
  }, [product, selectedVariant]);

  /* ---------------- PRICE ---------------- */
  const price =
    selectedVariant?.salePrice ??
    selectedVariant?.price ??
    product?.salePrice ??
    product?.price ??
    0;

  const outOfStock = (selectedVariant?.stockQuantity ?? 0) <= 0;

  /* ---------------- CART ---------------- */
  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartImage =
      media[selectedImage]?.type === "image"
        ? media[selectedImage].url
        : media.find(m => m.type === "image")?.url || FALLBACK_IMAGE;

    addItem({
      id: selectedVariant._id,
      productId: id!,
      name: product.name,
      price,
      image: cartImage,
      variantId: selectedVariant?._id || product._id,
      variantName: selectedVariant?.variantName || "Default",
      sku: selectedVariant?.sku || product.sku,
      shiprocketProductId: product.shiprocketProductId,
      shiprocketVariantId:
        selectedVariant?.shiprocketVariantId || null,
    });

    toast({
      title: "Added to cart 🛒",
      description: `${product.name} (${selectedVariant.variantName})`,
      duration: 4000,
    });

    openCart();
  };

  /* ---------------- SHARE ---------------- */
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
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen grid place-items-center">
        Product not found
      </div>
    );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* IMAGE / VIDEO SECTION */}
          <div>
            <div className="relative bg-white rounded-3xl p-6 shadow-sm overflow-hidden">
              {media[selectedImage]?.type === "image" ? (
                <div 
                  className="w-full h-[420px] overflow-hidden cursor-zoom-in relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onClick={() => setIsModalOpen(true)}
                >
                  <motion.img
                    src={media[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                    }}
                  />
                </div>
              ) : (
                <video
                  src={media[selectedImage]?.url}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-[420px] object-contain"
                />
              )}

              {media.length > 1 && (
                <>
                  <ChevronLeft
                    className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/80 rounded-full p-1 shadow-md hover:bg-white z-10"
                    size={32}
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + media.length) % media.length
                      )
                    }
                  />
                  <ChevronRight
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/80 rounded-full p-1 shadow-md hover:bg-white z-10"
                    size={32}
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage + 1) % media.length
                      )
                    }
                  />
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 justify-center overflow-x-auto no-scrollbar py-2">
              {media.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl cursor-pointer border-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? "border-primary shadow-md scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ₹{price}
              </span>
              {selectedVariant?.salePrice && (
                <span className="line-through text-muted-foreground">
                  ₹{selectedVariant.price}
                </span>
              )}
            </div>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="space-y-3">
                <p className="font-semibold">
                  Variant:
                  <span className="text-primary ml-2">
                    {selectedVariant?.variantName}
                  </span>
                </p>

                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((v: any) => (
                    <button
                      key={v._id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedImage(0);
                      }}
                      className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                        selectedVariant?._id === v._id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {v.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART */}
            <motion.button
              disabled={outOfStock}
              onClick={handleAddToCart}
              whileHover={
                !outOfStock ? { scale: 1.02 } : {}
              }
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                outOfStock
                  ? "bg-muted cursor-not-allowed text-gray-400"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <ShoppingCart size={22} />
              {outOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </motion.button>

            {/* SHARE BUTTON */}
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-all"
            >
              <Share2 size={18} />
              Share Product
            </motion.button>

            {/* TRUST BADGES */}
            <div className="flex gap-8 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium">
                <Shield size={18} className="text-primary" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Truck size={18} className="text-primary" />
                Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              whileHover={{ rotate: 90 }}
            >
              <X size={32} />
            </motion.button>

            {media[selectedImage]?.type === "image" ? (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={media[selectedImage]?.url}
                alt="preview"
                className="max-h-[90vh] max-w-full object-contain"
              />
            ) : (
              <video
                src={media[selectedImage]?.url}
                controls
                autoPlay
                className="max-h-[90vh] max-w-full object-contain"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail; 
