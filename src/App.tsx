/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Menu,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Smartphone,
  Facebook,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  soldPercentage?: number;
  rating: number;
  reviews: number;
  imageEmoji: string;
  freeDelivery?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---
const FLASH_SALE_PRODUCTS: Product[] = [
  { id: 1, name: "Samsung Galaxy A15", price: 18500, originalPrice: 28000, discount: 34, soldPercentage: 85, rating: 4.5, reviews: 120, imageEmoji: "📱" },
  { id: 2, name: "Wireless Earbuds Pro", price: 1200, originalPrice: 3500, discount: 66, soldPercentage: 91, rating: 4.2, reviews: 85, imageEmoji: "🎧" },
  { id: 3, name: "Nike Running Shoes", price: 3800, originalPrice: 7200, discount: 47, soldPercentage: 60, rating: 4.8, reviews: 210, imageEmoji: "👟" },
  { id: 4, name: "Maybelline Lipstick Set", price: 850, originalPrice: 1800, discount: 53, soldPercentage: 78, rating: 4.1, reviews: 55, imageEmoji: "💄" },
  { id: 5, name: "Smart Watch Series 8", price: 4500, originalPrice: 9000, discount: 50, soldPercentage: 65, rating: 4.4, reviews: 340, imageEmoji: "⌚" },
  { id: 6, name: "Gaming Controller", price: 2200, originalPrice: 4500, discount: 51, soldPercentage: 44, rating: 4.3, reviews: 98, imageEmoji: "🎮" },
];

const RECOMMENDED_PRODUCTS: Product[] = [
  { id: 7, name: "Laptop HP Pavilion 15", price: 52000, rating: 4.5, reviews: 234, imageEmoji: "💻", freeDelivery: true },
  { id: 8, name: "School Backpack Premium", price: 1500, rating: 4.3, reviews: 89, imageEmoji: "🎒", freeDelivery: true },
  { id: 9, name: "Polarized Sunglasses", price: 650, rating: 4.1, reviews: 312, imageEmoji: "🕶️" },
  { id: 10, name: "Electric Kettle 1.8L", price: 1800, rating: 4.7, reviews: 156, imageEmoji: "🫖", freeDelivery: true },
  { id: 11, name: "Selfie Ring Light", price: 900, rating: 4.4, reviews: 445, imageEmoji: "📷" },
  { id: 12, name: "Ladies Handbag", price: 2200, rating: 4.2, reviews: 98, imageEmoji: "👜" },
  { id: 13, name: "Power Bank 20000mAh", price: 1650, rating: 4.6, reviews: 567, imageEmoji: "🔋", freeDelivery: true },
  { id: 14, name: "Skincare Kit (5pcs)", price: 3200, rating: 4.8, reviews: 203, imageEmoji: "🧴", freeDelivery: true },
];

const JUST_FOR_YOU_PRODUCTS: Product[] = [
  { id: 15, name: "Wireless Printer", price: 8500, rating: 4.3, reviews: 45, imageEmoji: "🖨️" },
  { id: 16, name: "Yoga Mat Premium", price: 1100, rating: 4.5, reviews: 78, imageEmoji: "🧘" },
  { id: 17, name: "Non-Stick Pan Set", price: 2800, rating: 4.6, reviews: 112, imageEmoji: "🍳" },
  { id: 18, name: "WiFi Router Dual Band", price: 3200, rating: 4.4, reviews: 89, imageEmoji: "📡" },
  { id: 19, name: "Formal Leather Shoes", price: 4500, rating: 4.2, reviews: 67, imageEmoji: "👞" },
  { id: 20, name: "Indoor Plant Pot Set", price: 750, rating: 4.7, reviews: 34, imageEmoji: "🪴" },
];

const CATEGORIES = [
  { name: "Electronics", emoji: "📱", color: "bg-blue-100" },
  { name: "Fashion", emoji: "👗", color: "bg-pink-100" },
  { name: "Beauty", emoji: "💄", color: "bg-purple-100" },
  { name: "Home & Living", emoji: "🏠", color: "bg-yellow-100" },
  { name: "Sports", emoji: "⚽", color: "bg-green-100" },
  { name: "Groceries", emoji: "🍎", color: "bg-red-100" },
  { name: "Books", emoji: "📚", color: "bg-indigo-100" },
  { name: "Toys", emoji: "🧸", color: "bg-orange-100" },
];

const BRANDS = ["Samsung", "Apple", "Nike", "L'Oreal", "Xiaomi", "HP"];

// --- Components ---

const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState(6 * 60 * 60 - 1); // 5:59:59 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-2 items-center text-daraz-orange font-bold text-xl font-mono">
      <span className="bg-daraz-orange text-white px-2 py-1 rounded">
        {format(hours)}
      </span>
      <span>:</span>
      <span className="bg-daraz-orange text-white px-2 py-1 rounded">
        {format(minutes)}
      </span>
      <span>:</span>
      <span className="bg-daraz-orange text-white px-2 py-1 rounded">
        {format(seconds)}
      </span>
    </div>
  );
};

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnnounceVisible, setIsAnnounceVisible] = useState(true);

  // --- Handlers ---
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Slider Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const SLIDES = [
    { title: "11.11 Mega Sale", sub: "Up to 80% OFF on Top Brands", bg: "from-orange-500 to-red-600", color: "text-white" },
    { title: "Free Delivery Week", sub: "On all electronics and gadgets items", bg: "from-blue-600 to-indigo-800", color: "text-white" },
    { title: "New Trends in Fashion", sub: "Shop the latest winter collection 2026", bg: "from-pink-500 to-purple-600", color: "text-white" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 1. Announcement Bar */}
      <AnimatePresence>
        {isAnnounceVisible && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-daraz-orange text-white text-center py-2 px-4 relative overflow-hidden text-sm md:text-base font-bold flex items-center justify-center gap-4"
          >
            <span>🎉 11.11 Sale is LIVE! Up to 80% OFF — Free Delivery on Orders Over ৳500 | Shop Now →</span>
            <button 
              onClick={() => setIsAnnounceVisible(false)}
              className="absolute right-4 hover:bg-black/10 p-1 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm transition-all">
        {/* Top Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <span className="text-3xl font-black text-daraz-orange font-heading italic tracking-tighter">sabbir</span>
            </div>

            {/* Search */}
            <div className="flex-grow max-w-2xl relative group hidden md:block">
              <div className="flex border-2 border-daraz-orange rounded-lg overflow-hidden focus-within:ring-2 ring-daraz-orange/20">
                <input 
                  type="text" 
                  placeholder="Search in Sabbir..."
                  className="w-full px-4 py-2 outline-none"
                />
                <button className="bg-daraz-orange text-white px-6 hover:bg-orange-600 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
              <div className="flex flex-col items-center cursor-pointer group hover:text-daraz-orange transition-colors">
                <User size={24} />
                <span className="text-[10px] hidden md:block">Account</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group hover:text-daraz-orange transition-colors relative">
                <Heart size={24} fill={wishlist.length > 0 ? "currentColor" : "none"} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-daraz-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
                <span className="text-[10px] hidden md:block">Wishlist</span>
              </div>
              <div 
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center cursor-pointer group hover:text-daraz-orange transition-colors relative"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-daraz-orange text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] hidden md:block">Cart</span>
              </div>
            </div>
            
            <button className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Categories Tab (Horizontal Scroll) */}
        <div className="bg-white border-b overflow-x-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            {["All", "Electronics", "Fashion", "Beauty", "Home & Kitchen", "Sports", "Groceries", "Toys", "Books", "Automotive"].map((cat, idx) => (
              <button 
                key={cat} 
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all hover:text-daraz-orange ${idx === 0 ? "border-daraz-orange text-daraz-orange" : "border-transparent text-gray-500"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 flex-grow pb-12">
        {/* 3. Hero Slider */}
        <section className="mt-4 rounded-xl overflow-hidden relative group h-[200px] md:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`w-full h-full bg-gradient-to-r ${SLIDES[currentSlide].bg} flex flex-col items-center justify-center text-center p-8`}
            >
              <h2 className={`text-3xl md:text-6xl font-black mb-2 ${SLIDES[currentSlide].color}`}>{SLIDES[currentSlide].title}</h2>
              <p className={`text-sm md:text-xl md:mb-6 font-medium ${SLIDES[currentSlide].color} opacity-90`}>{SLIDES[currentSlide].sub}</p>
              <button className="bg-white text-daraz-orange px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform hidden md:block">
                Shop The Sale
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-white w-6" : "bg-white/40"}`} 
              />
            ))}
          </div>

          <button 
            onClick={() => setCurrentSlide((currentSlide - 1 + 3) % 3)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentSlide((currentSlide + 1) % 3)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        </section>

        {/* 4. Flash Sale */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-daraz-orange">⚡</span> Flash Sale
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Ends In:</span>
                <FlashSaleTimer />
              </div>
            </div>
            <button className="text-daraz-orange font-bold text-sm hover:underline">SHOP MORE</button>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
            {FLASH_SALE_PRODUCTS.map(product => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={product.id} 
                className="min-w-[180px] md:min-w-[200px] bg-white rounded-xl shadow-sm border border-gray-100 p-3 relative flex flex-col group overflow-hidden"
              >
                {/* Sale Badge */}
                <span className="absolute top-2 left-2 bg-daraz-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                  -{product.discount}%
                </span>

                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-5xl mb-3">
                  {product.imageEmoji}
                </div>

                <div className="flex-grow">
                  <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-daraz-orange transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-lg font-bold text-daraz-orange">৳{product.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</div>
                </div>

                {/* Sell Out Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1 text-gray-400 font-medium">
                    <span>{product.soldPercentage}% Sold</span>
                    <span>Hurry!</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-daraz-orange rounded-full" 
                      style={{ width: `${product.soldPercentage}%` }} 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-daraz-orange text-white py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add To Cart
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Shop By Category */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Shop By Category</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all`}>
                  {cat.emoji}
                </div>
                <span className="text-xs md:text-sm font-semibold group-hover:text-daraz-orange transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Sabbir Mall */}
        <section className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-blue-600">🏪</span> Sabbir Mall — Official Stores
            </h2>
            <button className="text-daraz-orange font-bold text-sm hover:underline">VIEW ALL</button>
          </div>
          <div className="flex overflow-x-auto gap-4 hide-scrollbar">
            {BRANDS.map(brand => (
              <div key={brand} className="min-w-[150px] p-4 text-center border rounded-xl hover:border-daraz-orange hover:shadow-md transition-all cursor-pointer group flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-50">
                  <ShieldCheck className="text-blue-600" />
                </div>
                <div className="font-bold text-sm mb-1">{brand}</div>
                <div className="text-[10px] text-blue-600 font-bold mb-3 flex items-center gap-1 justify-center">
                  <ShieldCheck size={12} />
                  OFFICIAL STORE
                </div>
                <button className="text-[10px] font-bold text-daraz-orange">Shop Now →</button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Promo Banners */}
        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="h-[180px] bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl p-8 flex flex-col justify-center text-white cursor-pointer hover:shadow-lg transition-all scale-[0.99] hover:scale-100">
            <h3 className="text-2xl font-black mb-2">Women's Fashion Week</h3>
            <p className="text-sm mb-4 opacity-90">Extra 20% OFF with code <span className="font-bold">FASHION20</span></p>
            <button className="w-fit bg-white text-pink-600 px-6 py-2 rounded-full font-bold text-sm">Shop Now</button>
          </div>
          <div className="h-[180px] bg-gradient-to-r from-blue-700 to-indigo-900 rounded-2xl p-8 flex flex-col justify-center text-white cursor-pointer hover:shadow-lg transition-all scale-[0.99] hover:scale-100">
            <h3 className="text-2xl font-black mb-2">Tech Deals</h3>
            <p className="text-sm mb-4 opacity-90">Buy 2 Get 1 FREE on all Mobile Accessories</p>
            <button className="w-fit bg-white text-blue-700 px-6 py-2 rounded-full font-bold text-sm">Shop Now</button>
          </div>
        </section>

        {/* 7. Recommended For You */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">🔥 Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {RECOMMENDED_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button className="border-2 border-daraz-orange text-daraz-orange px-12 py-3 rounded-lg font-bold hover:bg-daraz-orange hover:text-white transition-all transform active:scale-95">
              LOAD MORE
            </button>
          </div>
        </section>

        {/* 9. Just For You */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Just For You <span className="text-daraz-orange">🎯</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {JUST_FOR_YOU_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} compact />
            ))}
          </div>
        </section>

        {/* 10. Trust bar */}
        <section className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-8 rounded-2xl shadow-sm border">
          <TrustItem icon={<Truck className="text-daraz-orange" />} label="Fast Delivery" sub="To your doorstep" />
          <TrustItem icon={<RotateCcw className="text-daraz-orange" />} label="Easy Returns" sub="7-day hassle-free" />
          <TrustItem icon={<ShieldCheck className="text-daraz-orange" />} label="Secure Payment" sub="100% safe checkout" />
          <TrustItem icon={<Gift className="text-daraz-orange" />} label="Exclusive Deals" sub="Daily coupons" />
        </section>

        {/* 11. App Download */}
        <section className="mt-20 bg-gradient-to-r from-orange-400 to-daraz-orange rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Shop Smarter on the Sabbir App</h2>
              <ul className="mb-8 space-y-3 opacity-90 font-medium">
                <li className="flex items-center gap-3 justify-center md:justify-start">✓ Get App-only deals & coupons</li>
                <li className="flex items-center gap-3 justify-center md:justify-start">✓ Faster checkout & real-time tracking</li>
                <li className="flex items-center gap-3 justify-center md:justify-start">✓ Personalized recommendations</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-black text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-gray-900 transition-colors">
                  <Smartphone size={20} /> 📲 Google Play
                </button>
                <button className="bg-black text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-gray-900 transition-colors">
                  <Smartphone size={20} /> 🍎 App Store
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-[400px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl p-6 relative flex flex-col items-center justify-center -rotate-12 translate-y-20">
                <span className="text-4xl font-black text-daraz-orange italic">sabbir</span>
                <div className="mt-12 w-full space-y-4">
                  <div className="w-full h-8 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-8 bg-gray-100 rounded"></div>
                  <div className="w-1/2 h-8 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 grayscale"></div>
        </section>
      </main>

      {/* 13. Footer */}
      <footer className="bg-daraz-dark text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          {/* Col 1 */}
          <div>
            <span className="text-3xl font-black text-daraz-orange font-heading italic tracking-tighter mb-4 block">sabbir</span>
            <p className="text-gray-400 text-sm mb-6">Bangladesh's #1 Online Shopping Platform. Connecting millions of buyers and sellers across South Asia.</p>
            <div className="flex gap-4">
              <span className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-daraz-orange transition-colors"><Facebook size={20} /></span>
              <span className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-daraz-orange transition-colors"><Instagram size={20} /></span>
              <span className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-daraz-orange transition-colors"><Youtube size={20} /></span>
              <span className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-daraz-orange transition-colors"><Twitter size={20} /></span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-6">Customer Care</h4>
            {["Help Center", "How to Buy", "Return & Refund", "Shipping & Delivery", "Contact Us", "Sabbir Blog"].map(item => (
              <a key={item} href="#" className="block text-gray-400 text-sm hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "COD"].map(tag => (
                <span key={tag} className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs font-bold">{tag}</span>
              ))}
            </div>
            <div className="mt-8 text-gray-400 text-sm italic">
              100% Safe and Secure Checkout
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Sabbir App</h4>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-colors">
                <Smartphone className="text-daraz-orange" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Available on</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-colors">
                <Smartphone className="text-daraz-orange" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Download on the</div>
                  <div className="font-bold">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2025 Sabbir Bangladesh Ltd. All Rights Reserved. | Privacy Policy | Terms of Use
        </div>
      </footer>

      {/* 12. Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-daraz-bg">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart /> Your Shopping Cart ({cartCount})
                </h2>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={48} className="opacity-20" />
                    </div>
                    <p className="text-lg font-medium">Your cart is empty.</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="mt-4 text-daraz-orange font-bold hover:underline"
                    >
                      Start shopping!
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
                        {item.imageEmoji}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm mb-1 leading-tight">{item.name}</h4>
                        <div className="text-daraz-orange font-black mb-2">৳{item.price.toLocaleString()}</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-lg bg-white overflow-hidden text-sm">
                            <button className="px-2 py-1 hover:bg-gray-100">-</button>
                            <span className="px-3 font-bold">{item.quantity}</span>
                            <button className="px-2 py-1 hover:bg-gray-100">+</button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-daraz-orange">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-daraz-orange text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-95 transition-transform">
                    Proceed to Checkout
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">100% Secure Checkout Guaranteed</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

function ProductCard({ 
  product, 
  addToCart, 
  toggleWishlist, 
  isWishlisted,
  compact = false 
}: { 
  product: Product, 
  addToCart: (p: Product) => void,
  toggleWishlist: (id: number) => void,
  isWishlisted: boolean,
  compact?: boolean,
  key?: number | string
}) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative"
    >
      <button 
        onClick={() => toggleWishlist(product.id)}
        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm z-10 transition-all ${isWishlisted ? "bg-daraz-red text-white" : "bg-white text-gray-300 hover:text-daraz-red"}`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className={`aspect-square bg-gray-50 flex items-center justify-center ${compact ? 'text-4xl' : 'text-6xl'} relative`}>
        {product.imageEmoji}
        {product.freeDelivery && (
          <div className="absolute bottom-2 left-2 bg-daraz-green text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
            Free Delivery
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h3 className={`font-medium mb-2 group-hover:text-daraz-orange transition-colors h-10 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          {product.name}
        </h3>
        
        {!compact && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" className="opacity-30" />
            </div>
            <span className="text-[10px] text-gray-400">({product.reviews})</span>
          </div>
        )}

        <div className={`font-black text-daraz-orange ${compact ? 'text-base' : 'text-xl'}`}>৳{product.price.toLocaleString()}</div>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-daraz-orange text-white py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm transform active:scale-95"
        >
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
}

function TrustItem({ icon, label, sub }: { icon: ReactNode, label: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center group cursor-pointer">
      <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h5 className="font-bold text-sm mb-1">{label}</h5>
      <p className="text-gray-400 text-xs">{sub}</p>
    </div>
  );
}
