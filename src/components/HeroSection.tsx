import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useState, useEffect } from "react";

import IMG1 from "../assest/img1.png";
import IMG2 from "../assest/img2.png";
import IMG3 from "../assest/img3.png";

const HeroSection = () => {
  const badges = [
    { icon: "🎁", label: "Free Gift Wrap" },
    { icon: "🚚", label: "Fast Shipping" },
    { icon: "💝", label: "Gift Ready" },
    { icon: "✨", label: "Premium Quality" },
  ];

  // ✅ Image Carousel Logic
  const images = [IMG1, IMG2, IMG3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);

    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#fce7f3]/30 overflow-hidden pt-28 lg:pt-24 pb-12">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-pink-100/40 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">

          {/* LEFT CONTENT */}
          <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-lg border border-pink-50"
            >
              <Sparkles size={14} className="text-pink-400" />
              <span className="text-[10px] lg:text-xs font-bold text-pink-500 uppercase">
                Premium Kids Gift Store
              </span>
              <Heart size={12} className="text-pink-400 fill-pink-400" />
            </motion.div>

            {/* Heading */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight"
              >
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome to <br />
                  Kawai World
                </span>
              </motion.h1>

              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-2xl md:text-3xl font-medium text-purple-600"
              >
                Where Every Gift Sparks Joy ✨
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-lg text-gray-500 max-w-lg mx-auto lg:mx-0"
            >
              Cute toys, dreamy stationery & magical décor crafted to light up smiles and imagination for every special moment.
            </motion.p>

            {/* Badges */}
            <div className="flex overflow-x-auto no-scrollbar gap-3 px-2">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md whitespace-nowrap"
                >
                  <span>{badge.icon}</span>
                  <span className="text-xs font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE CAROUSEL */}
          <div className="relative order-1 lg:order-2 w-full max-w-[320px] sm:max-w-md lg:max-w-full mx-auto">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-[2.5rem] p-4 lg:p-8 shadow-xl border"
            >

              {/* Dots Indicator */}
              <div className="absolute top-4 right-6 flex gap-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-pink-500" : "w-2 bg-pink-300"
                    }`}
                  />
                ))}
              </div>

              {/* Image Carousel */}
              <div className="relative aspect-square flex items-center justify-center mt-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={index}
                    src={images[index]}
                    alt="Kawai Product"
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
              </div>

              {/* Bottom Badge */}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow">
                New Arrival 🌈
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;