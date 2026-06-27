/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { Shield, CreditCard, RefreshCw, Lock, HelpCircle, Flame } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';

import SupportWidget from './components/SupportWidget';
import AuthModal from './components/AuthModal';
import AdminConsole from './components/AdminConsole';
import { PRODUCTS } from './data';
import { Product, CartItem, Order, CategoryType } from './types';
import { CurrencyType } from './utils/currency';

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'customer' | 'admin'; name?: string } | null>(() => {
    const saved = localStorage.getItem('synapse_current_user_v1');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // Currency state
  const currency: CurrencyType = 'BDT';

  // Cart & Orders State (LocalStorage persistent)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('synapse_cart_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('synapse_orders_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Products state (persist to localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('synapse_products_v1');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  // Keep orders state synchronized if orders are added/modified in admin console
  useEffect(() => {
    const handleSyncOrders = () => {
      const saved = localStorage.getItem('synapse_orders_v1');
      if (saved) setOrders(JSON.parse(saved));
    };
    window.addEventListener('synapse_orders_updated', handleSyncOrders);
    return () => window.removeEventListener('synapse_orders_updated', handleSyncOrders);
  }, []);

  // Keep products state synchronized if changed in admin console or checkout
  useEffect(() => {
    const handleSyncProducts = () => {
      const saved = localStorage.getItem('synapse_products_v1');
      if (saved) setProducts(JSON.parse(saved));
    };
    window.addEventListener('synapse_products_updated', handleSyncProducts);
    return () => window.removeEventListener('synapse_products_updated', handleSyncProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('synapse_products_v1', JSON.stringify(products));
  }, [products]);

  // Query & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [sortBy, setSortBy] = useState('popular');

  // Modal Dialog states
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('synapse_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('synapse_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Auth Handlers
  const handleLoginSuccess = (email: string, role: 'customer' | 'admin', name?: string) => {
    const user = { email, role, name };
    setCurrentUser(user);
    localStorage.setItem('synapse_current_user_v1', JSON.stringify(user));
    setIsAuthOpen(false);
    if (role === 'admin') {
      setIsAdminView(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('synapse_current_user_v1');
    setIsAdminView(false);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual feedback helper
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckoutSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleClearCart = () => {
    setCart([]);
  };



  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and Sort implementation
  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // Popularity default
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col text-gray-200">
      
      {/* Primary Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onResetFilters={handleResetFilters}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {isAdminView && currentUser?.role === 'admin' ? (
        <AdminConsole currency={currency} onClose={() => setIsAdminView(false)} />
      ) : (
        <>
          {/* Hero, Filters and Search */}
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            products={products}
          />

          {/* Storefront Main Area */}
          <main className="flex-1 mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 w-full">
            
            {/* Products Grid Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest text-white">
                  {selectedCategory === 'all' && 'Featured Collections'}
                  {selectedCategory === 'streaming' && 'Premium Streaming Passes'}
                  {selectedCategory === 'vpn' && 'Military-Grade VPN Subscriptions'}
                  {selectedCategory === 'games' && 'Official Digital PC Keys'}
                  {selectedCategory === 'gift' && 'Official Gift Cards'}
                  {selectedCategory === 'educational' && 'Premium Educational Access'}
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 font-light">
                  Showing {sortedProducts.length} of {products.length} certified digital assets
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-gray-400 bg-white/5 px-4 py-2 border border-white/10 rounded-none self-start sm:self-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Fulfillment Nodes Online</span>
              </div>
            </div>

            {/* Empty Catalog State */}
            {sortedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center p-16 rounded-none border border-white/10 bg-[#0E0E10]" id="empty-catalog-state">
                <div className="text-4xl text-gray-600 mb-2">🔍</div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white mt-4">No matching digital assets found</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-sm font-light leading-relaxed">
                  We couldn't find any premium resources matching "{searchQuery}". Try refining your spellings or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 rounded-none bg-white text-black border border-white px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="products-catalog-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(prod) => setActiveProduct(prod)}
                  onAddToCart={(prod, e) => handleAddToCart(prod, e)}
                  currency={currency}
                />
              ))}
            </div>

            {/* Brand Value Props Grid */}
            <section className="mt-20 grid gap-0 sm:grid-cols-3 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="bg-[#0E0E10]/30 p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex h-9 w-9 items-center justify-center bg-indigo-600/15 text-indigo-400 mb-6 rounded-none">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Full 365-Day Warranties</h4>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed font-light">
                    Every single license key, game CD-Key, and active private stream profile is covered with continuous replacement policies for their entire duration. Zero downtime.
                  </p>
                </div>
              </div>

              <div className="bg-[#0E0E10]/30 p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex h-9 w-9 items-center justify-center bg-indigo-600/15 text-indigo-400 mb-6 rounded-none">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Encrypted Checkouts</h4>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed font-light">
                    Check out with peace of mind. We support robust card transactions, Google Pay, bKash, Nagad and major crypto tokens with an automatic 5% wholesale discount on coin networks.
                  </p>
                </div>
              </div>

              <div className="bg-[#0E0E10]/30 p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex h-9 w-9 items-center justify-center bg-indigo-600/15 text-indigo-400 mb-6 rounded-none">
                    <RefreshCw className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">5-Second Automated Mail</h4>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed font-light">
                    Our background script binds game credentials and subscription pools directly to your email instantly after transaction confirmation. Watch, encrypt, and play instantly.
                  </p>
                </div>
              </div>
            </section>

          </main>

          {/* High-End Editorial Footer Bar */}
          <footer className="border-t border-white/10 px-6 sm:px-8 lg:px-12 py-8 bg-[#0A0A0B] z-10">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-[10px] text-gray-500 uppercase tracking-widest">
                <span className="font-bold text-gray-400">&copy; {new Date().getFullYear()} Synapse Labs Corp.</span>
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full hidden sm:inline"></span>
                <span className="text-white/40">Encrypted Terminal Access</span>
              </div>
              
              <div className="flex gap-8 items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                  Systems Active
                </span>
                <span 
                  onClick={() => setIsSupportOpen(true)}
                  className="text-white hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Support Portal
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* MODALS & DRAWERS ORCHESTRATION */}
      
      {/* 1. Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        currency={currency}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 2. Slide-out Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckoutSuccess={handleCheckoutSuccess}
        onClearCart={handleClearCart}
        currency={currency}
      />



      {/* 4. Support Ticket & FAQ Widget */}
      <SupportWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* 5. User Authentication (Login/Register) Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
