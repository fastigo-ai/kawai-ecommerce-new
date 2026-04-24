// Navbar.jsx
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
import { getStoreProducts } from "../APi/api";

/* ---------------- DROPDOWN ITEM ---------------- */

const DropdownItem = ({ item }) => {
  return (
    <div className="relative group">
      <Link
        to={item.path || "#"}
        className="block py-1 font-medium text-foreground hover:text-secondary flex justify-between items-center"
      >
        {item.name}
        {item.children && <ChevronRight size={16} />}
      </Link>

      {item.children && (
        <div className="absolute left-full top-0 ml-0 hidden group-hover:block z-50">
          <div className="bg-card border rounded-xl shadow-lg p-4 min-w-[180px]">
            {item.children.map((child) => (
              <DropdownItem key={child.name} item={child} />
            ))}
          </div>
        </div>
      )}
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
  const [isScrolled, setIsScrolled] = useState(false);

  /* ---------- SEARCH STATES ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchRef = useRef(null);

  /* ---------- MENU ITEMS ---------- */
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

  /* ---------- RESTORE AUTH ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      dispatch(signIn({ user: JSON.parse(storedUser), token }));
    }
  }, [dispatch]);

  /* ---------- SEARCH API (DEBOUNCED) ---------- */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsLoadingProducts(true);

        const res = await getStoreProducts({
          search: searchTerm.trim(),
        });

        // ✅ Correct response extraction
        setResults(res?.products || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  /* ---------- CLICK OUTSIDE SEARCH ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ---------- SCROLL EFFECT ---------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => dispatch(signOut());

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/70 backdrop-blur-lg border-b shadow-lg py-2" 
          : "bg-white border-b py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/">
            <img src={Logo} alt="logo" className="w-12 h-12 rounded-full" />
          </Link>

          {/* DESKTOP MENU */}
{/* DESKTOP MENU */}
<div className="hidden md:flex space-x-8">
  {menuItems.map((item) => (
    <div
      key={item.name}
      className="relative"
      onMouseEnter={() => setHoveredMenu(item.name)}
      onMouseLeave={() => setHoveredMenu(null)}
    >
      <span className="cursor-pointer font-semibold flex items-center gap-1">
        {item.name}
        <ChevronDown size={16} />
      </span>

      {/* DROPDOWN */}
      <AnimatePresence>
        {hoveredMenu === item.name && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="bg-card border rounded-xl shadow p-6 min-w-[220px]">
              {item.subCategories.map((sub) => (
                <DropdownItem key={sub.name} item={sub} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}
</div>


          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SEARCH */}
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <>
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="relative flex items-center"
                  >
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-32 xs:w-40 sm:w-64 h-10 px-3 sm:px-4 pr-10 border rounded-full bg-white/50 focus:bg-white transition-all outline-none border-pink-200 focus:border-pink-500 text-sm"
                    />
                    <X
                      className="absolute right-3 cursor-pointer text-muted-foreground hover:text-pink-500"
                      size={16}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchTerm("");
                        setResults([]);
                      }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {searchTerm && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 right-0 w-[280px] sm:w-80 bg-white border rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto z-50 p-2"
                      >
                        {isLoadingProducts ? (
                          <div className="flex flex-col items-center p-8 space-y-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                              <Search size={20} className="text-pink-500" />
                            </motion.div>
                            <p className="text-xs text-muted-foreground">Searching magical products...</p>
                          </div>
                        ) : results.length ? (
                          results.map((p) => {
                            const firstVariant = p.variants?.[0];
                            const imageSrc =
                              firstVariant?.images?.[0]?.imageUrl ||
                              p.images?.[0]?.imageUrl ||
                              "https://via.placeholder.com/50";

                            return (
                              <motion.div
                                key={p._id}
                                whileHover={{ x: 5, backgroundColor: "rgba(244, 244, 245, 0.5)" }}
                                className="flex gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                                onClick={() => (
                                  navigate(`/product/${p.id}`),
                                  setResults([]),
                                  setIsSearchOpen(false),
                                  setSearchTerm("")
                                )}
                              >
                                <img
                                  src={imageSrc}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-pink-100"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-foreground line-clamp-1">
                                    {p.name}
                                  </p>
                                  <p className="text-xs font-bold text-pink-500">
                                    ₹{firstVariant?.salePrice || firstVariant?.price}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-2xl mb-2">🎈</p>
                            <p className="text-sm text-muted-foreground font-medium">
                              No magical items found
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Search
                  size={20}
                  className="cursor-pointer hover:text-pink-500 transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                />
              )}
            </div>

            {/* CART */}
            <button onClick={toggleCart} className="relative hover:text-pink-500 transition-colors">
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* USER */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-pink-500 transition-colors"
            >
              <User size={20} />
            </button>

            <UserDropdown
              isOpen={isDropdownOpen}
              isAuthenticated={!!user}
              user={user} // ✅ PASS USER
              onLogout={handleLogout}
              onSignInClick={() => setIsModalOpen(true)}
              onClose={() => setIsDropdownOpen(false)}
            />

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-t shadow"
          >
            <div className="px-4 py-4 space-y-4">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {/* CATEGORY HEADER */}
                  <button
                    onClick={() =>
                      setOpenMobileCategory(
                        openMobileCategory === item.name ? null : item.name
                      )
                    }
                    className="w-full flex justify-between items-center font-semibold py-2"
                  >
                    {item.name}
                    <ChevronDown
                      className={`transition-transform ${
                        openMobileCategory === item.name ? "rotate-180" : ""
                      }`}
                      size={18}
                    />
                  </button>

                  {/* SUBCATEGORIES */}
                  <AnimatePresence>
                    {openMobileCategory === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2"
                      >
                        {item.subCategories.map((sub) => (
                          <div key={sub.name}>
                            <Link
                              to={sub.path || "#"}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-1 font-medium text-muted-foreground"
                            >
                              {sub.name}
                            </Link>

                            {/* CHILDREN */}
                            {sub.children && (
                              <div className="pl-4 mt-1 space-y-1">
                                {sub.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-sm text-muted-foreground"
                                  >
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

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSignIn={undefined} />
    </nav>
  );
};

export default Navbar;
