import { motion } from "framer-motion";
import { Send, Gift, Sparkles } from "lucide-react";

const PromotionSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-8 md:p-16 text-white shadow-2xl"
        >
          {/* Decorative shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
              >
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-xs font-black uppercase tracking-widest">Exclusive Membership</span>
              </motion.div>

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black leading-tight"
              >
                Join the Magic Circle & <span className="text-yellow-300">Save 20%</span>
              </motion.h2>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/80 font-medium max-w-lg"
              >
                Subscribe to our magical newsletter and get early access to new drops, secret sales, and 20% off your first order!
              </motion.p>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative flex-1">
                  <input 
                    type="email" 
                    placeholder="Enter your magical email" 
                    className="w-full px-8 py-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl bg-white text-purple-600 font-black flex items-center justify-center gap-3 shadow-xl"
                >
                  <Send size={20} />
                  Subscribe Now
                </motion.button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-[3rem] blur-2xl animate-pulse" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] shadow-2xl">
                   <Gift size={120} className="text-white drop-shadow-2xl animate-float" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionSection;
