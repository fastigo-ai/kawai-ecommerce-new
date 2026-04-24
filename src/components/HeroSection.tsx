import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import IMG3 from "../assest/img3.png";

const HeroSection = () => {
  const badges = [
    { icon: "🎁", label: "Free Gift Wrap" },
    { icon: "🚚", label: "Fast Shipping" },
    { icon: "💝", label: "Gift Ready" },
    { icon: "✨", label: "Premium Quality" },
  ];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#fce7f3]/30 overflow-hidden pt-28 lg:pt-24 pb-12">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-pink-100/40 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-12 items-center text-center lg:text-left">

          {/* Content Left */}
          <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-lg shadow-pink-100 border border-pink-50"
            >
              <Sparkles size={14} className="text-pink-400" />
              <span className="text-[10px] lg:text-xs font-bold text-pink-500 uppercase tracking-tight">Premium Kids Gift Store</span>
              <Heart size={12} className="text-pink-400 fill-pink-400" />
            </motion.div>

            {/* Title Block */}
            <div className="space-y-3 lg:space-y-4">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.2] lg:leading-[1.1] tracking-tight"
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
                className="text-lg sm:text-2xl md:text-3xl font-medium text-purple-600 flex items-center justify-center lg:justify-start gap-2 lg:gap-3"
              >
                Where Every Gift Sparks Joy ✨
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-lg text-gray-500 font-normal max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Cute toys, dreamy stationery & magical décor crafted to light up smiles and imagination for every special moment.
            </motion.p>

            {/* Bottom Badge Row (Horizontal Scroll on Mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-row overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 gap-3 lg:gap-4 pt-4 lg:flex-wrap lg:justify-start"
            >
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 bg-white rounded-full shadow-md border border-gray-50 whitespace-nowrap min-w-fit"
                >
                  <span className="text-base lg:text-lg">{badge.icon}</span>
                  <span className="text-[10px] lg:text-xs font-medium text-gray-700">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image Right */}
          <div className="relative order-1 lg:order-2 w-full max-w-[320px] sm:max-w-md lg:max-w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white rounded-[2.5rem] lg:rounded-[3.5rem] p-4 lg:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white"
            >
              <div className="absolute top-4 lg:top-8 right-6 lg:right-12 flex gap-1.5 lg:gap-2">
                <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-pink-200" />
                <div className="w-6 h-2 lg:w-8 lg:h-2.5 rounded-full bg-pink-400" />
              </div>

              <div className="relative aspect-square flex items-center justify-center mt-4 lg:mt-6">
                <img
                  src={IMG3}
                  alt="Kawai World Product"
                  className="w-full h-full object-contain"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-6 lg:bottom-10 left-6 lg:left-10"
              >
                <div className="px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-[10px] lg:text-sm shadow-xl flex items-center gap-1.5 lg:gap-2">
                  New Arrival 🌈
                </div>
              </motion.div>
            </motion.div>

            <div className="absolute -top-6 -right-6 w-16 h-16 bg-pink-100/50 rounded-full blur-xl -z-10" />
            <div className="absolute -bottom-6 left-0 w-24 h-24 bg-purple-100/50 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;