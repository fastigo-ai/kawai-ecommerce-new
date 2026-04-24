import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play, Heart, MessageCircle, Share2 } from "lucide-react";

const InstagramReels = () => {
  const [reels] = useState([
    {
      id: "1",
      code: "DQCrBzNEzce",
      url: "https://www.instagram.com/reel/DQCrBzNEzce/embed",
      link: "https://www.instagram.com/reel/DQCrBzNEzce/",
      views: "12.4k",
      likes: "1.2k"
    },
    {
      id: "2",
      code: "DQ3bhaVjO8W",
      url: "https://www.instagram.com/reel/DQ3bhaVjO8W/embed",
      link: "https://www.instagram.com/reel/DQ3bhaVjO8W/",
      views: "8.9k",
      likes: "942"
    },
    {
      id: "3",
      code: "DQZRWqCgbFY",
      url: "https://www.instagram.com/reel/DQZRWqCgbFY/embed",
      link: "https://www.instagram.com/reel/DQZRWqCgbFY/",
      views: "15.2k",
      likes: "2.1k"
    },
  ]);

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Elite Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 border border-pink-100 font-black text-[10px] uppercase tracking-widest">
                <Instagram size={14} />
                Live from Instagram
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Our <span className="text-pink-500 italic">Magic</span> Moments
             </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end"
          >
             <p className="text-gray-500 font-bold mb-6 max-w-xs text-left md:text-right">
                Join our community and witness the joy our products bring to families worldwide.
             </p>
             <motion.a
                href="https://www.instagram.com/kawaiworld15/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl"
              >
                Follow @kawaiworld15
                <ExternalLink size={16} className="text-pink-500" />
              </motion.a>
          </motion.div>
        </div>

        {/* Reels Container (Horizontal Scroll on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-10 overflow-x-auto lg:overflow-x-visible pb-12 snap-x no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start"
            >
              <div className="relative aspect-[9/16] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-gray-100 border-4 lg:border-8 border-gray-900">
                
                {/* Embed */}
                <iframe
                  src={reel.url}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />

                {/* Glass Interaction Overlay (Appears on Hover) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8 pointer-events-none">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                       <Instagram size={20} className="text-white" />
                    </div>
                    <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                       {reel.views} Views
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col gap-4 items-end">
                        <div className="flex flex-col items-center gap-1">
                           <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                              <Heart size={20} className="text-white" />
                           </div>
                           <span className="text-[10px] font-black text-white">{reel.likes}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                           <MessageCircle size={20} className="text-white" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                           <Share2 size={20} className="text-white" />
                        </div>
                     </div>
                     
                     <motion.a 
                        href={reel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto block w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-2xl"
                     >
                        Watch on Instagram
                     </motion.a>
                  </div>
                </div>

                {/* Default Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:hidden transition-all duration-300">
                   <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <Play size={32} className="text-white fill-white" />
                   </div>
                </div>

                {/* Instagram Border Glow */}
                <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2.8rem] pointer-events-none group-hover:border-pink-500/50 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
