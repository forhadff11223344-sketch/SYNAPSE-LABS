/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Search, Trash2, CheckCircle, ChevronLeft, Inbox, 
  User, Calendar, ShieldCheck, Mail, AlertCircle, 
  Star, MessageSquare, HelpCircle, Eye, RefreshCw,
  Plus, Edit, Key, Package, FileText, Check, X,
  Sliders, Globe, Facebook, MessageCircle, Smartphone
} from 'lucide-react';
import { Order, Review, Product, CategoryType, GatewaySettings } from '../types';
import { formatPrice, CurrencyType } from '../utils/currency';
import { PRODUCTS, DEFAULT_GATEWAY_SETTINGS } from '../data';

interface AdminConsoleProps {
  onClose: () => void;
  currency: CurrencyType;
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  date: string;
  status: 'open' | 'resolved';
}

export default function AdminConsole({ onClose, currency }: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'orders' | 'reviews' | 'inventory' | 'gateways'>('tickets');
  
  // States for tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  
  // States for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  
  // States for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSearch, setReviewSearch] = useState('');

  // States for products/inventory
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<CategoryType>('all');
  
  // Modals / forms states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [managingKeysProduct, setManagingKeysProduct] = useState<Product | null>(null);
  const [newKeysInput, setNewKeysInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'product' | 'ticket' | 'review';
    id: string;
    message: string;
  } | null>(null);

  // Form Field States
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('streaming');
  const [formSubcategory, setFormSubcategory] = useState<string>('Netflix');
  const [formPrice, setFormPrice] = useState('2.99');
  const [formOriginalPrice, setFormOriginalPrice] = useState('15.49');
  const [formStockStatus, setFormStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDuration, setFormDuration] = useState('1 Month');
  const [formDeliveryTime, setFormDeliveryTime] = useState('Instant Email Delivery (1-5 seconds)');
  const [formFeatures, setFormFeatures] = useState('');
  const [formInstructions, setFormInstructions] = useState('');

  // Gateway / Support Settings States
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>(DEFAULT_GATEWAY_SETTINGS);
  const [formBkashNumber, setFormBkashNumber] = useState('');
  const [formNagadNumber, setFormNagadNumber] = useState('');
  const [formWhatsappNumber, setFormWhatsappNumber] = useState('');
  const [formDiscordLink, setFormDiscordLink] = useState('');
  const [formFacebookUrl, setFormFacebookUrl] = useState('');

  // Load all initial state from LocalStorage
  const loadData = () => {
    // Tickets
    const savedTickets = localStorage.getItem('synapse_tickets_v1');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      // Seed initial dummy tickets if empty to show functionality
      const seedTickets: Ticket[] = [
        {
          id: 'TCK-8492',
          name: 'Sarah Rahman',
          email: 'sarah.r@outlook.com',
          topic: 'Replacement',
          message: 'My Netflix shared account profile locked pin is not working today. Please issue a replacement or check if PIN changed.',
          date: 'Jun 25, 2026 09:12 AM',
          status: 'open'
        },
        {
          id: 'TCK-1940',
          name: 'Tariqul Islam',
          email: 'tariq.mfs@gmail.com',
          topic: 'Payment',
          message: 'I paid via bKash but did not write the correct TxID. My wallet is 01712233445, TxID was 9K82JD82X.',
          date: 'Jun 24, 2026 04:35 PM',
          status: 'resolved'
        },
        {
          id: 'TCK-3382',
          name: 'David Miller',
          email: 'miller.david@gmail.com',
          topic: 'Inquiry',
          message: 'Is the NordVPN license key compatible with Android TV app? I want to buy 1-Year subscription.',
          date: 'Jun 23, 2026 11:20 AM',
          status: 'resolved'
        }
      ];
      localStorage.setItem('synapse_tickets_v1', JSON.stringify(seedTickets));
      setTickets(seedTickets);
    }

    // Orders
    const savedOrders = localStorage.getItem('synapse_orders_v1');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Reviews
    const savedReviews = localStorage.getItem('synapse_reviews_v1');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Fallback reviews from data file
      const initialReviews: Review[] = [
        {
          id: 'rev-1',
          username: 'alex_cyber99',
          rating: 5,
          comment: 'Was skeptical at first, but the Netflix Shared account came in 2 seconds. Screen has its own lock PIN. Works perfectly on my Apple TV and iPad. Outstanding price!',
          date: 'June 24, 2026',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
        },
        {
          id: 'rev-2',
          username: 'emily_reads',
          rating: 5,
          comment: 'Purchased NordVPN 1 Year. Got a premium login instantly. Setup took less than a minute. Netflix US is fully unblocked on my side. Thank you Synapse Labs!',
          date: 'June 21, 2026',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
        }
      ];
      localStorage.setItem('synapse_reviews_v1', JSON.stringify(initialReviews));
      setReviews(initialReviews);
    }

    // Products / Inventory
    const savedProducts = localStorage.getItem('synapse_products_v1');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      localStorage.setItem('synapse_products_v1', JSON.stringify(PRODUCTS));
      setProducts(PRODUCTS);
    }

    // Gateway / Support Settings
    const savedSettings = localStorage.getItem('synapse_gateway_settings_v1');
    let activeSettings = DEFAULT_GATEWAY_SETTINGS;
    if (savedSettings) {
      try {
        activeSettings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse gateway settings, reverting to default', e);
      }
    } else {
      localStorage.setItem('synapse_gateway_settings_v1', JSON.stringify(DEFAULT_GATEWAY_SETTINGS));
    }
    setGatewaySettings(activeSettings);
    setFormBkashNumber(activeSettings.bkashNumber || '');
    setFormNagadNumber(activeSettings.nagadNumber || '');
    setFormWhatsappNumber(activeSettings.whatsappNumber || '');
    setFormDiscordLink(activeSettings.discordLink || '');
    setFormFacebookUrl(activeSettings.facebookUrl || '');
  };

  useEffect(() => {
    loadData();

    // Listen to local changes
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('synapse_tickets_updated', handleUpdate);
    window.addEventListener('synapse_orders_updated', handleUpdate);
    window.addEventListener('synapse_reviews_updated', handleUpdate);
    window.addEventListener('synapse_products_updated', handleUpdate);
    window.addEventListener('synapse_settings_updated', handleUpdate);

    return () => {
      window.removeEventListener('synapse_tickets_updated', handleUpdate);
      window.removeEventListener('synapse_orders_updated', handleUpdate);
      window.removeEventListener('synapse_reviews_updated', handleUpdate);
      window.removeEventListener('synapse_products_updated', handleUpdate);
      window.removeEventListener('synapse_settings_updated', handleUpdate);
    };
  }, []);

  // Update localStorage helper
  const saveProductsToStorage = (updated: Product[]) => {
    localStorage.setItem('synapse_products_v1', JSON.stringify(updated));
    setProducts(updated);
    window.dispatchEvent(new Event('synapse_products_updated'));
  };

  const saveTicketsToStorage = (updated: Ticket[]) => {
    localStorage.setItem('synapse_tickets_v1', JSON.stringify(updated));
    setTickets(updated);
    window.dispatchEvent(new Event('synapse_tickets_updated'));
  };

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSaveGatewaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: GatewaySettings = {
      bkashNumber: formBkashNumber.trim(),
      nagadNumber: formNagadNumber.trim(),
      whatsappNumber: formWhatsappNumber.trim(),
      discordLink: formDiscordLink.trim(),
      facebookUrl: formFacebookUrl.trim(),
    };
    localStorage.setItem('synapse_gateway_settings_v1', JSON.stringify(updatedSettings));
    setGatewaySettings(updatedSettings);
    window.dispatchEvent(new Event('synapse_settings_updated'));
    
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  const saveReviewsToStorage = (updated: Review[]) => {
    localStorage.setItem('synapse_reviews_v1', JSON.stringify(updated));
    setReviews(updated);
    window.dispatchEvent(new Event('synapse_reviews_updated'));
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    if (type === 'product') {
      const updated = products.filter(p => p.id !== id);
      saveProductsToStorage(updated);
    } else if (type === 'ticket') {
      const updated = tickets.filter(t => t.id !== id);
      saveTicketsToStorage(updated);
    } else if (type === 'review') {
      const updated = reviews.filter(r => r.id !== id);
      saveReviewsToStorage(updated);
    }
    setConfirmDelete(null);
  };

  // Ticket Operations
  const handleDeleteTicket = (id: string) => {
    setConfirmDelete({
      type: 'ticket',
      id,
      message: `Are you sure you want to permanently delete support ticket ${id}?`
    });
  };

  const handleResolveTicket = (id: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return { ...t, status: (t.status === 'resolved' ? 'open' : 'resolved') as 'open' | 'resolved' };
      }
      return t;
    });
    saveTicketsToStorage(updated);
  };

  // Review Operations
  const handleDeleteReview = (id: string) => {
    setConfirmDelete({
      type: 'review',
      id,
      message: "Are you sure you want to permanently delete this product review?"
    });
  };

  // Ticket Filter & Search
  const filteredTickets = tickets.filter(t => {
    const matchesFilter = ticketFilter === 'all' || t.status === ticketFilter;
    const matchesSearch = 
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.name.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.topic.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.message.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Orders Search
  const filteredOrders = orders.filter(o => {
    const searchString = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(searchString) ||
      o.email.toLowerCase().includes(searchString) ||
      o.paymentMethod.toLowerCase().includes(searchString) ||
      o.items.some(item => item.product.name.toLowerCase().includes(searchString))
    );
  });

  // Reviews Search
  const filteredReviews = reviews.filter(r => {
    const searchString = reviewSearch.toLowerCase();
    return (
      r.username.toLowerCase().includes(searchString) ||
      r.comment.toLowerCase().includes(searchString)
    );
  });

  // Products Filter & Search
  const filteredProducts = products.filter(p => {
    const matchesFilter = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch = 
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Product Operations
  const handleDeleteProduct = (productId: string) => {
    setConfirmDelete({
      type: 'product',
      id: productId,
      message: "Are you sure you want to permanently delete this digital product from the catalog? This is irreversible."
    });
  };

  const resetProductForm = () => {
    setFormId('');
    setFormName('');
    setFormCategory('streaming');
    setFormSubcategory('Netflix');
    setFormPrice('2.99');
    setFormOriginalPrice('15.49');
    setFormStockStatus('in_stock');
    setFormDescription('');
    setFormImage('');
    setFormDuration('1 Month');
    setFormDeliveryTime('Instant Email Delivery (1-5 seconds)');
    setFormFeatures('');
    setFormInstructions('');
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormSubcategory(product.subcategory);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.originalPrice.toString());
    setFormStockStatus(product.stockStatus);
    setFormDescription(product.description || '');
    setFormImage(product.image || '');
    setFormDuration(product.duration || '');
    setFormDeliveryTime(product.deliveryTime || '');
    setFormFeatures(product.features ? product.features.join('\n') : '');
    setFormInstructions(product.instructions ? product.instructions.join('\n') : '');
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim() || !formPrice.trim()) {
      alert('Please fill out all required fields (Product ID, Name, Price).');
      return;
    }

    const priceNum = parseFloat(formPrice);
    const originalPriceNum = parseFloat(formOriginalPrice) || priceNum;

    const updatedProduct: Product = {
      id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: formName.trim(),
      category: formCategory,
      subcategory: formSubcategory,
      price: priceNum,
      originalPrice: originalPriceNum,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      stockStatus: formStockStatus,
      description: formDescription.trim(),
      features: formFeatures.trim() ? formFeatures.split('\n').filter(Boolean) : [],
      deliveryTime: formDeliveryTime.trim(),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60',
      duration: formDuration.trim() || undefined,
      instructions: formInstructions.trim() ? formInstructions.split('\n').filter(Boolean) : [],
      preloadedKeys: editingProduct ? editingProduct.preloadedKeys : []
    };

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
    } else {
      if (products.some(p => p.id === updatedProduct.id)) {
        alert('A product with this ID already exists. Please choose a unique ID.');
        return;
      }
      updatedList = [...products, updatedProduct];
    }

    saveProductsToStorage(updatedList);
    setEditingProduct(null);
    setIsAddingProduct(false);
    resetProductForm();
  };

  const handleOpenManageKeys = (product: Product) => {
    setManagingKeysProduct(product);
    setNewKeysInput('');
  };

  const handleAddKeys = () => {
    if (!managingKeysProduct || !newKeysInput.trim()) return;

    const newKeys = newKeysInput
      .split('\n')
      .map(k => k.trim())
      .filter(Boolean);

    if (newKeys.length === 0) return;

    const updatedProduct = {
      ...managingKeysProduct,
      preloadedKeys: [...(managingKeysProduct.preloadedKeys || []), ...newKeys]
    };

    const totalKeys = updatedProduct.preloadedKeys.length;
    if (totalKeys > 2) {
      updatedProduct.stockStatus = 'in_stock';
    } else if (totalKeys > 0) {
      updatedProduct.stockStatus = 'low_stock';
    } else {
      updatedProduct.stockStatus = 'out_of_stock';
    }

    const updatedList = products.map(p => p.id === managingKeysProduct.id ? updatedProduct : p);
    saveProductsToStorage(updatedList);
    setManagingKeysProduct(updatedProduct);
    setNewKeysInput('');
  };

  const handleDeleteKey = (keyIndex: number) => {
    if (!managingKeysProduct) return;
    
    const keys = [...(managingKeysProduct.preloadedKeys || [])];
    keys.splice(keyIndex, 1);

    const updatedProduct = {
      ...managingKeysProduct,
      preloadedKeys: keys
    };

    const totalKeys = updatedProduct.preloadedKeys.length;
    if (totalKeys > 2) {
      updatedProduct.stockStatus = 'in_stock';
    } else if (totalKeys > 0) {
      updatedProduct.stockStatus = 'low_stock';
    } else {
      updatedProduct.stockStatus = 'out_of_stock';
    }

    const updatedList = products.map(p => p.id === managingKeysProduct.id ? updatedProduct : p);
    saveProductsToStorage(updatedList);
    setManagingKeysProduct(updatedProduct);
  };

  // Stat calculation helpers
  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 py-10 px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="group p-2 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all rounded-none focus:outline-none"
              title="Return to Storefront"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Synapse Security Console</span>
              </div>
              <h1 className="text-xl font-black uppercase tracking-widest text-white mt-1">Admin Dashboard</h1>
            </div>
          </div>
          
          {/* Quick tab switcher */}
          <div className="flex border border-white/10 bg-black/40 p-1 rounded-none flex-wrap gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded-none focus:outline-none ${
                activeTab === 'tickets' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Contact Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded-none focus:outline-none ${
                activeTab === 'orders' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded-none focus:outline-none ${
                activeTab === 'reviews' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded-none focus:outline-none ${
                activeTab === 'inventory' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inventory Assets ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('gateways')}
              className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded-none focus:outline-none ${
                activeTab === 'gateways' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
              id="admin-tab-gateways"
            >
              Gateway & Support
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1 */}
          <div className="border border-white/10 bg-[#0E0E10] p-6 rounded-none relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gray-800/60 font-black text-6xl select-none pointer-events-none font-mono">
              INB
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Inbox className="h-3.5 w-3.5 text-indigo-400" />
              <span>Pending Submissions</span>
            </div>
            <div className="mt-4 text-3xl font-black text-white italic font-mono">
              {openTicketsCount} <span className="text-xs font-normal text-gray-400 uppercase tracking-wide">Tickets Open</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-light">Direct feedback from customer contact form.</p>
          </div>

          {/* Stat 2 */}
          <div className="border border-white/10 bg-[#0E0E10] p-6 rounded-none relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gray-800/60 font-black text-6xl select-none pointer-events-none font-mono">
              REV
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>Total Gross Sales</span>
            </div>
            <div className="mt-4 text-3xl font-black text-emerald-400 italic font-mono">
              {formatPrice(totalRevenue, currency)}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-light">Calculated from completed checkout orders.</p>
          </div>

          {/* Stat 3 */}
          <div className="border border-white/10 bg-[#0E0E10] p-6 rounded-none relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gray-800/60 font-black text-6xl select-none pointer-events-none font-mono">
              REVS
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>Moderated Reviews</span>
            </div>
            <div className="mt-4 text-3xl font-black text-white italic font-mono">
              {reviews.length} <span className="text-xs font-normal text-gray-400 uppercase tracking-wide">Reviews active</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-light">Verified user feedback listed in detail panels.</p>
          </div>

          {/* Stat 4 */}
          <div className="border border-white/10 bg-[#0E0E10] p-6 rounded-none relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gray-800/60 font-black text-6xl select-none pointer-events-none font-mono">
              INV
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-indigo-400" />
              <span>Digital Inventory</span>
            </div>
            <div className="mt-4 text-3xl font-black text-white italic font-mono">
              {products.length} <span className="text-xs font-normal text-gray-400 uppercase tracking-wide">Products</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-light">
              {products.reduce((sum, p) => sum + (p.preloadedKeys?.length || 0), 0)} keys preloaded across catalog.
            </p>
          </div>
        </div>

        {/* Main Tab Content */}
        
        {/* TAB 1: CONTACT SUBMISSIONS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E0E10] border border-white/10 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search submissions by Ticket ID, Name, Email, Topic, Message..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full bg-black border border-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none rounded-none"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">Filter State:</span>
                <button
                  onClick={() => setTicketFilter('all')}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                    ticketFilter === 'all' ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  All ({tickets.length})
                </button>
                <button
                  onClick={() => setTicketFilter('open')}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                    ticketFilter === 'open' ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Open ({tickets.filter(t => t.status === 'open').length})
                </button>
                <button
                  onClick={() => setTicketFilter('resolved')}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                    ticketFilter === 'resolved' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Resolved ({tickets.filter(t => t.status === 'resolved').length})
                </button>
              </div>
            </div>

            {/* Submissions List */}
            {filteredTickets.length === 0 ? (
              <div className="text-center p-16 border border-white/10 bg-black/25">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">No Contact Submissions Found</h3>
                <p className="text-xs text-gray-500 mt-2 font-light">No support tickets match your filter criteria or search phrase.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className={`border p-5 rounded-none transition-all ${
                      ticket.status === 'open' 
                        ? 'border-red-500/20 bg-red-950/5 hover:border-red-500/30' 
                        : 'border-white/10 bg-[#0E0E10] hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-indigo-400">{ticket.id}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-none ${
                            ticket.status === 'open' 
                              ? 'border-red-500/30 bg-red-500/15 text-red-400' 
                              : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-white/10 px-2 py-0.5">
                            {ticket.topic}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-gray-400">
                          <span className="font-bold text-white">{ticket.name}</span>
                          <span className="text-gray-500">&lt;{ticket.email}&gt;</span>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 self-start sm:self-auto">
                        <Calendar className="h-3 w-3" />
                        <span>{ticket.date}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-300 leading-relaxed bg-black/40 p-4 border border-white/5 font-light whitespace-pre-wrap">
                      {ticket.message}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4 pt-1">
                      <div className="text-[10px] text-gray-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        {ticket.status === 'open' ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>Action Required</span>
                          </>
                        ) : (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>Closed / Archived</span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveTicket(ticket.id)}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                            ticket.status === 'open'
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                              : 'border-white/20 text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {ticket.status === 'open' ? 'Mark Resolved' : 'Reopen Ticket'}
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete submission</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E0E10] border border-white/10 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search orders by Order ID, Customer Email, Payment Method, Products..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-black border border-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none rounded-none"
                />
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="text-center p-16 border border-white/10 bg-black/25">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">No Customer Orders Found</h3>
                <p className="text-xs text-gray-500 mt-2 font-light">Have any purchases been processed? Create a sandbox transaction to view them here.</p>
              </div>
            ) : (
              <div className="border border-white/10 overflow-hidden bg-[#0E0E10]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer Email</th>
                      <th className="p-4">Payment System</th>
                      <th className="p-4">Assets Purchased</th>
                      <th className="p-4 text-right">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-indigo-400 font-bold">{order.id}</td>
                        <td className="p-4 text-gray-400 font-sans">{order.date}</td>
                        <td className="p-4 font-sans text-white font-medium">{order.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border border-indigo-500/30 bg-indigo-500/5 text-indigo-400">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-sans">
                          <div className="space-y-1">
                            {order.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="text-xs text-gray-300">
                                {item.product.name} <span className="text-indigo-400 font-bold">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right text-white font-black italic text-sm">
                          {formatPrice(order.total, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E0E10] border border-white/10 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search reviews by username or comment text..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full bg-black border border-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none rounded-none"
                />
              </div>
            </div>

            {/* Reviews list */}
            {filteredReviews.length === 0 ? (
              <div className="text-center p-16 border border-white/10 bg-black/25">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">No Reviews Found</h3>
                <p className="text-xs text-gray-500 mt-2 font-light">No reviews match your search query.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border border-white/10 bg-[#0E0E10] p-5 rounded-none flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={review.avatar}
                            alt={review.username}
                            className="h-8 w-8 rounded-none object-cover border border-white/10 bg-black"
                            onError={(e) => {
                              e.currentTarget.src = `https://picsum.photos/seed/${review.id}/100/100`;
                            }}
                          />
                          <div>
                            <span className="text-xs font-black text-white">{review.username}</span>
                            <div className="text-[9px] text-gray-500 font-mono">{review.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400 font-bold">
                          <Star className="h-3 w-3 fill-indigo-400 text-indigo-400 shrink-0" />
                          <span>{review.rating}.0</span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-gray-300 font-light leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INVENTORY ASSETS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in" id="admin-inventory-section">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E0E10] border border-white/10 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products by ID, name, subcategory..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-black border border-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                  id="admin-product-search-input"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">Category:</span>
                {(['all', 'streaming', 'vpn', 'games', 'gift', 'educational'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none border transition-all ${
                      productCategoryFilter === cat ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                    id={`admin-filter-btn-${cat}`}
                  >
                    {cat}
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    resetProductForm();
                    setIsAddingProduct(true);
                    setEditingProduct(null);
                  }}
                  className="ml-auto md:ml-4 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
                  id="admin-create-asset-btn"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Asset</span>
                </button>
              </div>
            </div>

            {/* Products Table/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center p-16 border border-white/10 bg-black/25" id="admin-no-products-alert">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">No Inventory Assets Found</h3>
                <p className="text-xs text-gray-500 mt-2 font-light">No products matched your filters or search query.</p>
              </div>
            ) : (
              <div className="grid gap-4" id="admin-products-list-grid">
                {filteredProducts.map((product) => {
                  const preloadedCount = product.preloadedKeys?.length || 0;
                  return (
                    <div 
                      key={product.id}
                      className="border border-white/10 bg-[#0E0E10] p-5 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
                      id={`admin-product-row-${product.id}`}
                    >
                      {/* Product Left Section (Info) */}
                      <div className="flex items-center gap-4 flex-1">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-14 w-20 object-cover border border-white/10 bg-black shrink-0 animate-fade-in"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-white">{product.name}</span>
                            <span className="text-[9px] font-mono text-gray-500 uppercase px-1.5 py-0.5 border border-white/5 bg-black/30">
                              ID: {product.id}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500">
                            <span className="font-bold text-gray-400 capitalize">{product.category} &gt; {product.subcategory}</span>
                            <span>•</span>
                            <span className="text-indigo-400 font-bold">{formatPrice(product.price, currency)}</span>
                            {product.originalPrice > product.price && (
                              <span className="line-through text-gray-600">{formatPrice(product.originalPrice, currency)}</span>
                            )}
                            {product.duration && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-gray-400">{product.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Center Section (Keys Stock) */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:w-80 shrink-0">
                        <div className="space-y-1.5 flex-1">
                          <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-1.5">
                            <Key className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Digital Delivery Stock</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-white">
                              {preloadedCount} Preloaded Keys
                            </span>
                            {preloadedCount === 0 ? (
                              <span className="text-[9px] text-gray-500 italic bg-white/5 px-2 py-0.5">
                                Fallback Mock Gen
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${
                            product.stockStatus === 'in_stock' 
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                              : product.stockStatus === 'low_stock'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                              : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              product.stockStatus === 'in_stock' 
                                ? 'bg-emerald-400' 
                                : product.stockStatus === 'low_stock'
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-rose-400'
                            }`} />
                            {product.stockStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Product Right Section (Actions) */}
                      <div className="flex items-center gap-2 justify-end self-start md:self-auto shrink-0">
                        <button
                          onClick={() => handleOpenManageKeys(product)}
                          className="px-3 py-2 text-[9px] font-black uppercase tracking-widest bg-black border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/15 text-gray-300 hover:text-indigo-400 transition-all flex items-center gap-1.5"
                          title="Manage Preloaded Keys"
                          id={`admin-btn-keys-${product.id}`}
                        >
                          <Key className="h-3.5 w-3.5" />
                          <span>Preload Keys ({preloadedCount})</span>
                        </button>
                        
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="px-3 py-2 text-[9px] font-black uppercase tracking-widest bg-black border border-white/10 hover:border-white text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                          title="Edit Product Details"
                          id={`admin-btn-edit-${product.id}`}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-2 text-[9px] font-black uppercase tracking-widest bg-black border border-rose-500/20 hover:bg-rose-600 hover:text-white text-rose-400 transition-all"
                          title="Delete Product"
                          id={`admin-btn-delete-${product.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MANUAL GATEWAY & SUPPORT SETTINGS */}
        {activeTab === 'gateways' && (
          <div className="space-y-6 animate-fade-in" id="admin-gateways-section">
            <div className="bg-[#0E0E10] border border-white/10 p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">
                  Manual Gateways & Customer Support Settings
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-light">
                  Configure real-time bKash and Nagad numbers, along with custom WhatsApp, Discord, and Facebook help desk nodes.
                </p>
              </div>

              {showSaveSuccess && (
                <div className="border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-2 animate-fade-in">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Gateway and Support Settings Saved Successfully! Customers will see the new parameters immediately.</span>
                </div>
              )}

              <form onSubmit={handleSaveGatewaySettings} className="space-y-6">
                {/* Mobile Financial Services (MFS) Gateways */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Manual MFS Gateway Nodes</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        bKash Receiver Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 01784-912834"
                        value={formBkashNumber}
                        onChange={(e) => setFormBkashNumber(e.target.value)}
                        className="w-full bg-black border border-white/10 py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                        id="admin-settings-bkash"
                      />
                      <p className="text-[9px] text-gray-500 mt-1.5 leading-normal">
                        Active personal bKash number formatted as displayed to clients. Example: <span className="font-mono text-gray-400">01784-912834</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Nagad Receiver Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 01955-483294"
                        value={formNagadNumber}
                        onChange={(e) => setFormNagadNumber(e.target.value)}
                        className="w-full bg-black border border-white/10 py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                        id="admin-settings-nagad"
                      />
                      <p className="text-[9px] text-gray-500 mt-1.5 leading-normal">
                        Active personal Nagad number formatted as displayed to clients. Example: <span className="font-mono text-gray-400">01955-483294</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Outreach & Direct Support Channels */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Globe className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Social Support & Community Hubs</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        WhatsApp Help Desk Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +8801784912834"
                        value={formWhatsappNumber}
                        onChange={(e) => setFormWhatsappNumber(e.target.value)}
                        className="w-full bg-black border border-white/10 py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                        id="admin-settings-whatsapp"
                      />
                      <p className="text-[9px] text-gray-500 mt-1.5 leading-normal">
                        Standard internationally accessible WhatsApp number with country code for client queries.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Discord Server Invite Link *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://discord.gg/invite"
                        value={formDiscordLink}
                        onChange={(e) => setFormDiscordLink(e.target.value)}
                        className="w-full bg-black border border-white/10 py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                        id="admin-settings-discord"
                      />
                      <p className="text-[9px] text-gray-500 mt-1.5 leading-normal">
                        Permanent invite code link to the customer support guild or help hub.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Facebook Brand / Support Page *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://facebook.com/synapselabs"
                        value={formFacebookUrl}
                        onChange={(e) => setFormFacebookUrl(e.target.value)}
                        className="w-full bg-black border border-white/10 py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                        id="admin-settings-facebook"
                      />
                      <p className="text-[9px] text-gray-500 mt-1.5 leading-normal">
                        Official Facebook page URL for branding, status announcements, and outreach.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] text-gray-500 font-mono">
                    Node Status: <span className="text-emerald-400">● Broadcast Online</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-none bg-white text-black hover:bg-gray-200 transition-all focus:outline-none font-bold cursor-pointer"
                    id="admin-settings-save-btn"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD/EDIT PRODUCT MODAL */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in" id="admin-product-modal">
            <div className="bg-[#0E0E10] border border-white/10 w-full max-w-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="absolute right-4 top-4 text-gray-500 hover:text-white p-1"
                id="admin-product-modal-close"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">
                  {editingProduct ? 'Modify Digital Asset' : 'Register New Asset'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-light">
                  Specify catalog parameters, categories, pricing, and fulfillment attributes.
                </p>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Product ID (Unique Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProduct}
                      placeholder="e.g. netflix-ultra-1m"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Display Title Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Netflix Premium 4K Ultra HD"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Store Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const val = e.target.value as CategoryType;
                        setFormCategory(val);
                        // Auto match typical subcategory
                        if (val === 'streaming') setFormSubcategory('Netflix');
                        else if (val === 'vpn') setFormSubcategory('VPN');
                        else if (val === 'games') setFormSubcategory('Games');
                        else if (val === 'gift') setFormSubcategory('Gift Cards');
                        else if (val === 'educational') setFormSubcategory('Educational Tools');
                      }}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    >
                      <option value="streaming">Streaming Pass</option>
                      <option value="vpn">VPN License</option>
                      <option value="games">PC Game Key</option>
                      <option value="gift">Gift Card</option>
                      <option value="educational">Educational Tools</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Subcategory Tag *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Netflix, Spotify, NordVPN"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value as any)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Billing Cycle Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Month, 1 Year, Lifetime"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Offer Sale Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 2.99"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Original Compare-at Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 15.49"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Manual Catalog Stock Status
                    </label>
                    <select
                      value={formStockStatus}
                      onChange={(e) => setFormStockStatus(e.target.value as any)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Asset Representative Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Fulfillment Node Speed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Instant Delivery (1-5 seconds)"
                      value={formDeliveryTime}
                      onChange={(e) => setFormDeliveryTime(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                    Product Description Paragraph
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide a comprehensive summary of features and user terms..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none leading-relaxed"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Feature Bullets (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Shared Account (Private Profile)&#10;4K HDR Stream Quality&#10;1 Device Connected Limit"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Locker Redemption Instructions (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Go to netflix.com/login&#10;Enter credentials delivered to your locker&#10;Select Profile #3, enter Lock PIN"
                      value={formInstructions}
                      onChange={(e) => setFormInstructions(e.target.value)}
                      className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-none border border-white/10 hover:border-white text-gray-400 hover:text-white transition-all focus:outline-none"
                    id="admin-form-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-none bg-white text-black hover:bg-gray-200 transition-all focus:outline-none font-bold"
                    id="admin-form-submit-btn"
                  >
                    {editingProduct ? 'Commit Changes' : 'Publish Asset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PRELOADED KEYS MANAGER MODAL */}
        {managingKeysProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in" id="admin-keys-modal">
            <div className="bg-[#0E0E10] border border-white/10 w-full max-w-xl p-6 sm:p-8 space-y-6 relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setManagingKeysProduct(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-white p-1 focus:outline-none"
                id="admin-keys-modal-close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="shrink-0">
                <div className="flex items-center gap-2 text-indigo-400 text-xs">
                  <Key className="h-4.5 w-4.5" />
                  <span className="font-black uppercase tracking-widest">Inventory Asset Locker</span>
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest mt-1">
                  {managingKeysProduct.name}
                </h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  ID: {managingKeysProduct.id} • {managingKeysProduct.preloadedKeys?.length || 0} active credentials
                </p>
              </div>

              {/* Paste new credentials */}
              <div className="shrink-0 bg-black/40 border border-white/5 p-4 space-y-3">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                    Load New Keys / Credentials (One per line)
                  </label>
                  <p className="text-[10px] text-gray-500 leading-normal font-light mb-2">
                    Enter direct credentials or keys. For accounts, we suggest using `Email:Password:ProfilePIN` format.
                  </p>
                </div>
                
                <textarea
                  rows={4}
                  placeholder="synapselabs@premium.com:password123:PIN_4829&#10;synapselabs_shared2@premium.com:pass456:PIN_9104"
                  value={newKeysInput}
                  onChange={(e) => setNewKeysInput(e.target.value)}
                  className="w-full bg-black border border-white/10 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none rounded-none font-mono leading-relaxed"
                  id="admin-new-keys-textarea"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddKeys}
                    className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none bg-indigo-600 hover:bg-indigo-500 text-white transition-all focus:outline-none"
                    id="admin-load-keys-submit"
                  >
                    Load Credentials to Node
                  </button>
                </div>
              </div>

              {/* Active Credentials list */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 border-t border-white/5 pt-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2.5">
                  Currently preloaded keys pool ({managingKeysProduct.preloadedKeys?.length || 0})
                </div>

                {(!managingKeysProduct.preloadedKeys || managingKeysProduct.preloadedKeys.length === 0) ? (
                  <div className="text-center py-8 text-xs text-gray-600 font-light italic bg-black/10 border border-white/5">
                    No keys preloaded yet. Automatic fallback logic will generate secure, subcategory-specific mock credentials on-checkout.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {managingKeysProduct.preloadedKeys.map((key, idx) => (
                      <div 
                        key={idx}
                        className="bg-black/80 border border-white/5 px-3 py-2 flex items-center justify-between gap-4"
                      >
                        <span className="font-mono text-xs text-indigo-200 truncate select-all">
                          {key}
                        </span>
                        <button
                          onClick={() => handleDeleteKey(idx)}
                          className="text-gray-500 hover:text-rose-400 p-1 transition-colors shrink-0 focus:outline-none"
                          title="Revoke Key"
                          id={`admin-btn-revoke-key-${idx}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setManagingKeysProduct(null)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-none border border-white/10 hover:border-white text-gray-400 hover:text-white transition-all focus:outline-none"
                  id="admin-keys-manager-close-btn"
                >
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM CONFIRMATION DIALOG */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" id="admin-confirm-delete-modal">
            <div className="bg-[#0E0E10] border border-rose-500/30 w-full max-w-md p-6 space-y-6 relative">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Security / Action Authorization</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mt-1">
                  Confirm Permanent Deletion
                </h3>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {confirmDelete.message}
                </p>
                <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-wide">
                  ID Target: {confirmDelete.id}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white text-gray-400 hover:text-white transition-all focus:outline-none rounded-none"
                  id="admin-btn-cancel-delete"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white transition-all focus:outline-none rounded-none"
                  id="admin-btn-confirm-delete"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
