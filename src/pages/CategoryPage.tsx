import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List,
  PackageSearch
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getStoreProducts, getCategories } from "../APi/api";

const ITEMS_PER_PAGE = 12;

const CategoryPage = () => {
  const { category: categoryHandle } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL State Persistence
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "nameaz";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD CATEGORIES ---------------- */
  useEffect(() => {
    const loadCats = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCats();
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        
        let categoryId = undefined;
        if (categoryHandle && categoryHandle !== "all") {
          const matchedCat = categories.find(c => 
            c.handle === categoryHandle || 
            c.name?.toLowerCase().replace(/\s+/g, "-") === categoryHandle.toLowerCase()
          );
          if (matchedCat) {
            categoryId = matchedCat._id;
          } else {
            // Use the handle as fallback so backend can try to resolve it
            categoryId = categoryHandle;
            if (categories.length > 0) {
               console.warn("Category handle not found in local list, letting backend resolve:", categoryHandle);
            }
          }
        }

        const res = await getStoreProducts({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          category: categoryId,
          sortBy: currentSort
        });

        const productData = res?.data?.products || res?.products || [];
        const totalCount = res?.data?.total || res?.total || 0;

        setProducts(productData);
        setTotalProducts(totalCount);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryHandle, currentPage, currentSort, categories]);

  /* ---------------- HELPERS ---------------- */
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value.toString());
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const activeCategoryTitle = useMemo(() => {
    if (!categoryHandle || categoryHandle === "all") return "All Products";
    const cat = categories.find(c => c.handle === categoryHandle || c.name.toLowerCase() === categoryHandle.replace("-", " "));
    return cat?.name || categoryHandle.replace("-", " ");
  }, [categoryHandle, categories]);

  return (
    <div className="min-h-screen bg-white pt-10 lg:pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ----- TITLE SECTION ----- */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight capitalize"
          >
            {activeCategoryTitle}
          </motion.h1>
        </div>

        {/* ----- CONTROLS BAR (Matches Image) ----- */}
        <div className="flex items-center justify-between mb-12 py-4 border-b border-gray-50">
           <div className="relative group">
              <select 
                value={currentSort}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-gray-50/50 border border-gray-100 font-bold text-gray-600 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all text-sm cursor-pointer shadow-sm"
              >
                <option value="nameaz">Sort by Name (A - Z)</option>
                <option value="nameza">Sort by Name (Z - A)</option>
                <option value="priceaz">Sort by Price (Low - High)</option>
                <option value="priceza">Sort by Price (High - Low)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>

           <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-xl border border-gray-100 shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
           </div>
        </div>

        {/* ----- PRODUCT GRID / LIST ----- */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4 lg:gap-8`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`${viewMode === 'grid' ? 'aspect-[3/4]' : 'h-40'} bg-gray-50 rounded-[2rem] animate-pulse`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <PackageSearch size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">No Treasures Found</h3>
              <p className="text-gray-400 max-w-xs">We couldn't find any products in this collection.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-3 sm:gap-6 lg:gap-8`}>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} index={index} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>

            {/* ----- PREMIUM PAGINATION ----- */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => updateParams({ page: currentPage - 1 })}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-500 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateParams({ page: pageNum })}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                          isCurrent 
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-100 scale-110" 
                          : "bg-white text-gray-400 hover:bg-pink-50 hover:text-pink-500 border border-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => updateParams({ page: currentPage + 1 })}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-500 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
