import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut, signIn, selectUser } from "../redux/slices/authSlice";
import { useCart } from "../contexts/CartContext";
import Logo from "../assest/logoA.png";
import UserDropdown from "./UserDropdown";
import SignInModal from "./SignInModal";
import { getAllProducts } from "../APi/api";

const cn = (...classes) => classes.filter(Boolean).join(" ");

/* ---------------- DROPDOWN ITEM ---------------- */
const DropdownItem = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group/item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={item.path || "#"}
        className={cn(
          "flex justify-between items-center px-4 py-2.5 my-0.5 rounded-lg font-medium transition-all duration-200",
          "hover:bg-pink-50 hover:text-pink-600 text-slate-700"
        )}
      >
        {item.name}
        {item.children && (
          <ChevronRight 
            size={14} 
            className={cn("transition-transform", hovered ? "translate-x-1" : "")} 
          />
        )}
      </Link>

      <AnimatePresence>
        {item.children && hovered && (
          <motion.div
            className="absolute left-[98%] top-0 ml-1 bg-white border border-slate-100 rounded-2xl shadow-xl p-3 min-w-[200px] z-[60]"
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.path}
                className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- NAVBAR ---------------- */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { getItemCount, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  const menuItems = [
    {
      name: "Products",
      subCategories: [
        {
          name: "Decor",
          path: "/category/decor",
          children: [
            { name: "Candles", path: "/category/candles" },
            { name: "Ceramics", path: "/category/ceramics" },
            { name: "Fridge Magnets", path: "/category/fridge" },
            { name: "Kids Chair", path: "/category/kid" },
            { name: "Organisers", path: "/category/organisers" },
          ],
        },
        {
          name: "Electronics",
          path: "/category/electronics",
          children: [
            { name: "Learning Toys", path: "/category/learning" },
            { name: "Outdoor Toys", path: "/category/outdoor" },
          ],
        },
        {
          name: "Essentials",
          path: "/category/essentials",
          children: [
            { name: "Swimming", path: "/category/swimming" },
            { name: "Soaps", path: "/category/soaps" },
            { name: "Wallets", path: "/category/wallets" },
            { name: "Mugs", path: "/category/mugs" },
            { name: "Tooth Brushes", path: "/category/toothbrushes" },
          ],
        },
        {
          name: "Festive Gifting",
          path: "/category/festive",
          children: [
            { name: "Ceramics", path: "/category/ceramics" },
            { name: "Christmas Collection", path: "/category/christmas" },
            { name: "Paper Bags", path: "/category/paperbags" },
            { name: "Valentine’s Day", path: "/category/valentine" },
          ],
        },
        {
          name: "Stationery",
          path: "/category/stationery",
          children: [
            { name: "Boards", path: "/category/boards" },
            { name: "Bookmarks", path: "/category/bookmarks" },
            { name: "Calculators", path: "/category/calculators" },
            { name: "Erasers", path: "/category/erasers" },
            { name: "Pencils", path: "/category/pencils" },
            { name: "Pens", path: "/category/pens" },
            { name: "Pouches", path: "/category/pouches" },
          ],
        },
      ],
    },
    {
      name: "Toys & Games",
      subCategories: [
        { name: "Balls", path: "/category/balls" },
        { name: "Cards", path: "/category/cards" },
        { name: "Educational", path: "/category/educational" },
        { name: "Games", path: "/category/game" },
        { name: "Toys", path: "/category/toy" },
      ],
    },
    {
      name: "Water Bottles",
      subCategories: [
        { name: "Bottles", path: "/category/bottle" },
        { name: "Mugs", path: "/category/mug" },
        { name: "Sippers", path: "/category/sipper" },
        { name: "Tumblers", path: "/category/tumbler" },
      ],
    },
    {
      name: "Bags & Pouches",
      subCategories: [
        { name: "Bags", path: "/category/bag" },
        { name: "Pouches", path: "/category/pouche" },
        { name: "Duffle Bags", path: "/category/duffle" },
        { name: "Luggage", path: "/category/luggage" },
        { name: "Sling Bags", path: "/category/sling" },
      ],
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      dispatch(signIn({ user: JSON.parse(storedUser), token }));
    }
  }, [dispatch]);

  // Enhanced Search Logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsLoadingProducts(true);
        const res = await getAllProducts({ search: searchTerm.trim() });
        const products = res?.data?.products || res?.products || [];
        setResults(products);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setResults([]);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => dispatch(signOut());

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/">
            <img src={Logo} alt="logo" className="w-12 h-12 rounded-full" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-10 h-full">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group flex items-center h-full"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <span className={cn(
                  "cursor-pointer font-semibold text-slate-700 hover:text-pink-500 transition-colors flex items-center gap-1 py-2",
                  hoveredMenu === item.name ? "text-pink-500" : ""
                )}>
                  {item.name}
                  <ChevronDown size={16} className={cn("transition-transform duration-300", hoveredMenu === item.name ? "rotate-180" : "")} />
                </span>

                <AnimatePresence>
                  {hoveredMenu === item.name && (
                    <motion.div
                      className="absolute top-[90%] left-0 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 min-w-[240px] z-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.subCategories.map((sub) => (
                        <DropdownItem key={sub.name} item={sub} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* SEARCH BOX */}
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <div className="relative flex items-center">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="flex items-center"
                  >
                    <input
                      autoFocus
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-48 lg:w-64 h-10 px-4 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/20 border-pink-100"
                    />
                    <X
                      className="absolute right-3 top-2.5 cursor-pointer text-slate-400 hover:text-pink-500 transition-colors"
                      size={18}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchTerm("");
                        setResults([]);
                      }}
                    />
                  </motion.div>

                  {/* SEARCH RESULTS DROPDOWN */}
                  <AnimatePresence>
                    {searchTerm && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 right-0 w-72 md:w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-[100] p-1"
                      >
                        {isLoadingProducts ? (
                          <div className="p-8 text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mb-2"
                            />
                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Searching magical treasures...</p>
                          </div>
                        ) : results.length > 0 ? (
                          <div className="p-1 space-y-1">
                            {results.map((p) => {
                              const title = p.name || p.title || "Product";
                              const price = p.price || p.variants?.[0]?.price || "--";
                              const imageSrc = p.images?.[0]?.imageUrl || p.image?.[0]?.src || p.variants?.[0]?.image?.[0]?.src || "https://via.placeholder.com/50";
                              
                              return (
                                <div
                                  key={p._id || p.id}
                                  className="flex gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer transition-all duration-200 group"
                                  onClick={() => {
                                    navigate(`/product/${p.id || p._id}`);
                                    setIsSearchOpen(false);
                                    setSearchTerm("");
                                  }}
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                                    <img src={imageSrc} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                  </div>
                                  <div className="flex-1 overflow-hidden flex flex-col justify-center">
                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-pink-600 transition-colors">{title}</p>
                                    <p className="text-xs text-pink-500 font-black">₹{price}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-3xl mb-2">🎈</p>
                            <p className="text-sm text-slate-400 font-bold">No products found</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-pink-50 rounded-full transition-colors group">
                  <Search size={22} className="text-slate-600 group-hover:text-pink-500" />
                </button>
              )}
            </div>

            <button onClick={toggleCart} className="relative p-2 hover:bg-pink-50 rounded-full group transition-colors">
              <ShoppingCart size={22} className="text-slate-600 group-hover:text-pink-500" />
              {getItemCount() > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 text-[10px] bg-pink-500 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-pink-200">
                  {getItemCount()}
                </span>
              )}
            </button>

            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  isDropdownOpen ? "bg-pink-100 text-pink-600" : "hover:bg-pink-50 text-slate-600"
                )}
              >
                <User size={22} />
              </button>
              <UserDropdown
                isOpen={isDropdownOpen}
                isAuthenticated={!!user}
                user={user}
                onLogout={handleLogout}
                onSignInClick={() => setIsModalOpen(true)}
                onClose={() => setIsDropdownOpen(false)}
              />
            </div>

            <button className="md:hidden p-2 text-slate-600 hover:text-pink-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t overflow-hidden shadow-inner"
          >
             <div className="px-4 py-6 space-y-2">
               {menuItems.map((item) => (
                 <div key={item.name} className="border-b border-slate-50 pb-2">
                   <button 
                    onClick={() => setOpenMobileCategory(openMobileCategory === item.name ? null : item.name)}
                    className="w-full flex justify-between items-center font-bold py-3 text-slate-800"
                   >
                     {item.name}
                     <ChevronDown className={cn("transition-transform duration-300", openMobileCategory === item.name ? "rotate-180" : "")} size={20} />
                   </button>
                   <AnimatePresence>
                    {openMobileCategory === item.name && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 space-y-4 pb-4 mt-2"
                      >
                        {item.subCategories.map(sub => (
                          <div key={sub.name}>
                            <Link key={sub.name} to={sub.path} onClick={() => setIsMenuOpen(false)} className="block text-slate-800 font-bold mb-2">
                              {sub.name}
                            </Link>
                            {sub.children && (
                              <div className="pl-4 space-y-3">
                                {sub.children.map(child => (
                                  <Link key={child.name} to={child.path} onClick={() => setIsMenuOpen(false)} className="block text-slate-500 text-sm font-medium">
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                   </AnimatePresence>
                 </div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SignInModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSignIn={(userData) => console.log("Login success", userData)}
      />
    </nav>
  );
};

export default Navbar; 
