import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner1 from '../assest/banner3.jpeg';
import banner2 from '../assest/banner4.jpeg';
import banner3 from '../assest/banner5.jpeg';

const banners = [
  {
    id: 1,
    img: banner1,
    title: "Enchanted Playground",
    subtitle: "Every toy tells a story of wonder and joy.",
    accent: "text-pink-500",
    badge: "New Arrivals"
  },
  {
    id: 2,
    img: banner2,
    title: "Summer Splash",
    subtitle: "Durable sippers for endless outdoor adventures.",
    accent: "text-blue-500",
    badge: "Summer Essential"
  },
  {
    id: 3,
    img: banner3,
    title: "Creative Studio",
    subtitle: "Art supplies that spark big, bright ideas.",
    accent: "text-purple-500",
    badge: "Best Seller"
  },
];

const BannerCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[750px] relative overflow-hidden bg-gray-50">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          }
        }}
        effect="fade"
        className="w-full h-full elite-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {({ isActive }) => (
              <div className="w-full h-full relative flex items-center">
                {/* Background Image with Zoom Effect */}
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: isActive ? 1 : 1.1 }}
                  transition={{ duration: 5, ease: "easeOut" }}
                  src={banner.img}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
                  <div className="max-w-2xl space-y-3 lg:space-y-8 text-center lg:text-left mx-auto lg:mx-0">
                    
                    <AnimatePresence>
                      {isActive && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-3 py-1 lg:px-5 lg:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[7px] lg:text-[10px] uppercase tracking-[0.2em]"
                          >
                            <Sparkles size={10} className="text-pink-400" />
                            {banner.badge}
                          </motion.div>

                          <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-2xl sm:text-5xl lg:text-8xl font-bold text-white leading-tight tracking-tight"
                          >
                            {banner.title.split(' ')[0]} <br />
                            <span className={banner.accent + " italic"}>{banner.title.split(' ').slice(1).join(' ')}</span>
                          </motion.h2>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="text-[10px] sm:text-sm lg:text-2xl text-gray-200 font-normal leading-relaxed max-w-[200px] sm:max-w-sm lg:max-w-lg mx-auto lg:mx-0"
                          >
                            {banner.subtitle}
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="flex items-center justify-center lg:justify-start gap-4 lg:gap-8 pt-2 lg:pt-4"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate('/category/all')}
                              className="px-6 py-3 lg:px-10 lg:py-5 bg-white text-gray-900 rounded-xl lg:rounded-2xl font-bold text-[10px] lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 shadow-2xl transition-all"
                            >
                              Shop Collection
                              <ArrowRight size={18} className="text-pink-500 lg:w-5 lg:h-5" />
                            </motion.button>
                            
                            <button className="text-white font-bold text-[10px] lg:text-sm uppercase tracking-widest border-b-2 border-white/30 hover:border-white transition-all pb-1 whitespace-nowrap">
                               View Lookbook
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                  </div>
                </div>

                {/* Side Glass Accents */}
                <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-white/5 backdrop-blur-sm -z-1 border-l border-white/10 hidden lg:block" />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .custom-bullet {
          width: 30px !important;
          height: 3px !important;
          border-radius: 2px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }
        @media (min-width: 1024px) {
          .custom-bullet {
            width: 40px !important;
            height: 4px !important;
          }
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 50px !important;
        }
        @media (min-width: 1024px) {
          .swiper-pagination-bullet-active {
            width: 60px !important;
          }
        }
        .elite-swiper .swiper-pagination {
          bottom: 20px !important;
          text-align: center !important;
          padding-left: 0 !important;
        }
        @media (min-width: 1024px) {
          .elite-swiper .swiper-pagination {
            bottom: 40px !important;
            text-align: left !important;
            padding-left: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;
