import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play, Heart, MessageCircle, Share2 } from "lucide-react";


import Play1 from "../assest/video/get.mp4";
import Play2 from "../assest/video/get1.mp4";
import Play3 from "../assest/video/get2.mp4";

const InstagramReels = () => {
  const videoRefs = useRef([]);

  const reels = [
    { id: "1", video: Play1 },
    { id: "2", video: Play2 },
    { id: "3", video: Play3 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 } // 60% visible → play
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);


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
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-12 snap-x no-scrollbar pl-6 pr-4 md:px-0 md:mx-0">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              whileHover={{ scale: 1.03 }}
              className="min-w-[85vw] md:min-w-0 bg-white rounded-3xl shadow-xl overflow-hidden relative snap-start"
            >
              <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Reel #{index + 1}
              </div>

              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.video}
                muted
                loop
                playsInline
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
