import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Toys & Games',
      emoji: '🎮',
      description: 'Educational & Fun Games',
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-200/50',
      path: '/category/Toys & Games'
    },
    {
      name: 'Water Bottles',
      emoji: '🍶',
      description: 'Cute & Colorful Sippers',
      color: 'from-sky-500/20 to-blue-500/20',
      borderColor: 'border-blue-200/50',
      path: '/category/Water bottles'
    },
    {
      name: 'Bags & Pouches',
      emoji: '🎒',
      description: 'Magical Travel Companions',
      color: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-200/50',
      path: '/category/Bags & Pouches'
    },
    {
      name: 'Decor',
      emoji: '✨',
      description: 'Sparkling Room Magic',
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-200/50',
      path: '/category/Decor'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-[#fafafa]">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 border border-pink-100 font-black text-xs uppercase tracking-widest">
              <Sparkles size={14} />
              Explore Collections
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Shop by <span className="text-pink-500 italic">Category</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 font-normal max-w-sm"
          >
            Discover amazing products designed to spark creativity, learning, and endless fun for your little ones.
          </motion.p>
        </div>

        {/* Categories Grid (Horizontal Scroll on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible pb-8 snap-x no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[240px] lg:min-w-0 snap-start"
            >
              <Link to={category.path} className="group block">
                <motion.div
                  whileHover={{ y: -15, scale: 1.02 }}
                  className={`
                    relative h-[280px] lg:h-[400px] rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-8 
                    bg-gradient-to-br ${category.color}
                    backdrop-blur-xl border-2 ${category.borderColor}
                    shadow-xl shadow-gray-200/50
                    flex flex-col justify-between overflow-hidden
                  `}
                >
                  {/* Floating light effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-5xl lg:text-7xl mb-4 lg:mb-6 inline-block"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.5 
                      }}
                    >
                      {category.emoji}
                    </motion.div>
                    <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2 tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 font-medium text-xs lg:text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-gray-900">Shop</span>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300"
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
