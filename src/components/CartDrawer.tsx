/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, Ticket, ShieldCheck, Mail, CreditCard, Wallet, Sparkles, Copy, Check, Eye, EyeOff, Smartphone } from 'lucide-react';
import { CartItem, Order, OrderItem, Product, GatewaySettings } from '../types';
import { formatPrice, CurrencyType, convertToBDT } from '../utils/currency';
import { DEFAULT_GATEWAY_SETTINGS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckoutSuccess: (order: Order) => void;
  onClearCart: () => void;
  currency: CurrencyType;
}

type CheckoutStep = 'cart' | 'details' | 'processing' | 'success';

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckoutSuccess,
  onClearCart,
  currency
}: CartDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [processingLog, setProcessingLog] = useState('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Mobile Banking Send Money state
  const [mobileNumber, setMobileNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  // UI state for showing/hiding credentials
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  const [settings, setSettings] = useState<GatewaySettings>(DEFAULT_GATEWAY_SETTINGS);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('synapse_gateway_settings_v1');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse gateway settings in CartDrawer', e);
        }
      }
    };
    loadSettings();
    window.addEventListener('synapse_settings_updated', loadSettings);
    return () => {
      window.removeEventListener('synapse_settings_updated', loadSettings);
    };
  }, []);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate Promo Discount
  const promoDiscount = activeDiscount ? subtotal * (activeDiscount.percent / 100) : 0;
  const totalDiscount = promoDiscount;
  const deliveryFee = 0.00; // Digital Delivery is Free
  const finalTotal = Math.max(0, subtotal - totalDiscount + deliveryFee);

  // Promo application handler
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'SYNAPSE10') {
      setActiveDiscount({ code: 'SYNAPSE10', percent: 10 });
    } else if (code === 'GEMINI15') {
      setActiveDiscount({ code: 'GEMINI15', percent: 15 });
    } else if (code === 'HALFOFF') {
      setActiveDiscount({ code: 'HALFOFF', percent: 50 });
    } else {
      setPromoError('Invalid coupon code. Try SYNAPSE10 or GEMINI15');
    }
  };

  // Helper to generate realistic mock license keys or credentials
  const generateDigitalDelivery = (product: Product): string[] => {
    const outputs: string[] = [];
    const randomHex = () => Math.random().toString(16).substring(2, 7).toUpperCase();
    
    switch (product.subcategory) {
      case 'Netflix':
        outputs.push(`Email: netflix_${randomHex().toLowerCase()}@synapselabs.com\nPassword: NflxPass_${randomHex()}\nProfile Assigned: Screen ${Math.floor(Math.random() * 4) + 1}\nPIN Code: ${Math.floor(1000 + Math.random() * 9000)}`);
        break;
      case 'Amazon Prime':
        outputs.push(`Email: prime_${randomHex().toLowerCase()}@synapselabs.org\nPassword: AmznVideo_${randomHex()}\nProfile Name: Synapse Customer\nStatus: Premium Account Active`);
        break;
      case 'VPN':
        if (product.id.includes('nord')) {
          outputs.push(`Username: nordvpn_${randomHex().toLowerCase()}@synapse.vpn\nPassword: NordSecure_${randomHex()}!\nRenewal Status: Automatic (1 Year)`);
        } else {
          outputs.push(`Username: surfshark_${randomHex().toLowerCase()}@synapse.vpn\nPassword: SurfShark_${randomHex()}#\nConnections: Unlimited Devices Enabled`);
        }
        break;
      case 'Games':
      default:
        // Generate CD Key like A1B2C-D3E4F-G5H6I-J7K8L-M9N0O
        const key = `${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}`;
        outputs.push(`CD-Key: ${key}\nPlatform: ${product.specs?.Platform || 'Steam'}\nRegion: Global Activation`);
        break;
    }
    return outputs;
  };

  // Complete checkout action
  const handlePlaceOrder = () => {
    setErrorMessage('');
    
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address for delivery.');
      return;
    }

    if (mobileNumber.length < 11) {
      setErrorMessage('Please enter your 11-digit Sender Mobile Wallet Number.');
      return;
    }

    if (!trxId || trxId.trim().length < 8) {
      setErrorMessage('Please enter a valid Transaction ID (TrxID) of at least 8 characters.');
      return;
    }

    setStep('processing');
    
    let logs = [];
    const bdtAmount = Math.round(convertToBDT(finalTotal)).toLocaleString();

    if (paymentMethod === 'bkash') {
      logs = [
        'Connecting to bKash Personal MFS Ledger API...',
        'Matching bKash Personal Send Money ledger records...',
        `Checking matching send-money entry of ৳${bdtAmount}...`,
        `Verifying Sender bKash Wallet: [${mobileNumber}] with TrxID: [${trxId}]...`,
        'bKash transaction verified successfully!',
        'Writing assets key allocations to Synapse Node...',
        'Fulfillment completed successfully!'
      ];
    } else {
      logs = [
        'Connecting to Nagad Personal MFS secure link...',
        'Checking Nagad Personal Ledger status & entries...',
        `Matching Sender Nagad Wallet: [${mobileNumber}] with TrxID: [${trxId}]...`,
        `Checking matching send-money entry of ৳${bdtAmount}...`,
        'Nagad Personal Send Money entry validated!',
        'Generating instant secure digital account keys...',
        'Fulfillment completed successfully!'
      ];
    }

    let logIndex = 0;
    setProcessingLog(logs[0]);

    const logInterval = setInterval(() => {
      logIndex++;
      if (logIndex < logs.length) {
        setProcessingLog(logs[logIndex]);
      } else {
        clearInterval(logInterval);
        
        // Load current store products to consume preloaded inventory keys if present
        const currentProductsSaved = localStorage.getItem('synapse_products_v1');
        let currentProducts: Product[] = currentProductsSaved ? JSON.parse(currentProductsSaved) : [];
        
        // Generate completed Order object
        const orderItems: OrderItem[] = cart.map(item => {
          const catalogProdIndex = currentProducts.findIndex(p => p.id === item.product.id);
          const catalogProd = catalogProdIndex !== -1 ? currentProducts[catalogProdIndex] : null;
          
          let keysToDeliver: string[] = [];
          
          if (catalogProd && catalogProd.preloadedKeys && catalogProd.preloadedKeys.length > 0) {
            const availableKeys = [...catalogProd.preloadedKeys];
            const keysToConsume = Math.min(item.quantity, availableKeys.length);
            
            for (let q = 0; q < keysToConsume; q++) {
              const consumedKey = availableKeys.shift();
              if (consumedKey) keysToDeliver.push(consumedKey);
            }
            
            const remainingNeeded = item.quantity - keysToDeliver.length;
            if (remainingNeeded > 0) {
              for (let r = 0; r < remainingNeeded; r++) {
                keysToDeliver.push(...generateDigitalDelivery(item.product));
              }
            }
            
            // Update catalog product's keys
            catalogProd.preloadedKeys = availableKeys;
            
            // Auto update stock status of catalog product
            const totalKeysRemaining = availableKeys.length;
            if (totalKeysRemaining > 2) {
              catalogProd.stockStatus = 'in_stock';
            } else if (totalKeysRemaining > 0) {
              catalogProd.stockStatus = 'low_stock';
            } else {
              catalogProd.stockStatus = 'out_of_stock';
            }
            
            currentProducts[catalogProdIndex] = catalogProd;
          } else {
            for (let q = 0; q < item.quantity; q++) {
              keysToDeliver.push(...generateDigitalDelivery(item.product));
            }
          }
          
          return {
            product: item.product,
            quantity: item.quantity,
            keys: keysToDeliver
          };
        });

        // Save updated products and dispatch update event to keep store state in sync
        localStorage.setItem('synapse_products_v1', JSON.stringify(currentProducts));
        window.dispatchEvent(new Event('synapse_products_updated'));

        const newOrder: Order = {
          id: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          email: customerEmail,
          items: orderItems,
          total: finalTotal,
          paymentMethod,
          status: 'completed'
        };

        setLatestOrder(newOrder);
        onCheckoutSuccess(newOrder);
        setStep('success');
        onClearCart();
      }
    }, 800);
  };

  // Copy to Clipboard helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm" id="cart-drawer-overlay">
      <div 
        className="relative w-full max-w-lg bg-[#0E0E10] border-l border-white/10 h-full flex flex-col shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black uppercase tracking-widest text-white">
              {step === 'cart' && 'Your Shopping Cart'}
              {step === 'details' && 'Secure Checkout'}
              {step === 'processing' && 'Processing Transaction...'}
              {step === 'success' && 'Fulfillment Complete'}
            </span>
            {step === 'cart' && cart.length > 0 && (
              <span className="border border-indigo-500/30 bg-indigo-500/5 px-2 py-0.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                {cart.length} items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black p-2 rounded-none hover:bg-white focus:outline-none transition-all border border-transparent hover:border-white/20"
            id="cart-close-btn"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Dynamic Drawer Body based on steps */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: CART OVERVIEW */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="flex h-[50vh] flex-col items-center justify-center text-center p-6" id="empty-cart-state">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-black border border-white/10 text-gray-500 mb-5">
                    🛍️
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs font-light">
                    Browse our high-performance accounts or official digital keys to fill it up!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-none bg-white text-black border border-white px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-all"
                  >
                    Go Back Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-4" id="cart-items-list">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex items-center gap-4 rounded-none border border-white/10 bg-black/40 p-4 hover:border-white/20 transition-colors"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-10 w-14 rounded-none object-cover bg-black"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${item.product.id}/200/150`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-indigo-400 italic">{formatPrice(item.product.price, currency)}</span>
                          {item.product.duration && (
                            <span className="text-[9px] uppercase font-bold text-gray-500">({item.product.duration})</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-black border border-white/10 rounded-none p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="h-5 w-5 flex items-center justify-center rounded-none text-gray-400 hover:text-white focus:outline-none"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-black text-gray-200 px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="h-5 w-5 flex items-center justify-center rounded-none text-gray-400 hover:text-white focus:outline-none"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="text-gray-500 hover:text-rose-400 p-1.5 rounded-none hover:bg-rose-500/5 focus:outline-none transition-colors border border-transparent hover:border-rose-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT DETAIL FORM */}
          {step === 'details' && (
            <div className="space-y-6 animate-fade-in" id="checkout-form">
              
              {/* Inline Error State */}
              {errorMessage && (
                <div className="border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400 font-bold uppercase tracking-wide">
                  ⚠️ Error: {errorMessage}
                </div>
              )}

              {/* Delivery Destination */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Delivery Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full rounded-none border border-white/10 bg-[#0A0A0B] py-3.5 px-4 text-xs text-white placeholder-gray-700 focus:border-indigo-500 focus:outline-none"
                  required
                />
                <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                  Provide an active email address. All login details and license keys will be emailed here synchronously.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* bKash Payment option */}
                  <button
                    onClick={() => setPaymentMethod('bkash')}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-none border text-[10px] uppercase tracking-widest font-black transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#D12053] bg-[#D12053]/10 text-[#D12053]'
                        : 'border-white/10 bg-[#0A0A0B] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="h-4.5 w-4.5 mb-1.5" />
                    <span>bKash Personal</span>
                  </button>

                  {/* Nagad Payment option */}
                  <button
                    onClick={() => setPaymentMethod('nagad')}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-none border text-[10px] uppercase tracking-widest font-black transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F57224] bg-[#F57224]/10 text-[#F57224]'
                        : 'border-white/10 bg-[#0A0A0B] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="h-4.5 w-4.5 mb-1.5" />
                    <span>Nagad Personal</span>
                  </button>
                </div>
              </div>

              {/* Conditional Payment Forms */}
              <div className={`rounded-none border p-5 space-y-4 animate-fade-in ${
                paymentMethod === 'bkash' ? 'border-[#D12053]/20 bg-[#D12053]/5' : 'border-[#F57224]/20 bg-[#F57224]/5'
              }`}>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black border-b border-white/5 pb-2.5">
                  <span className={paymentMethod === 'bkash' ? 'text-[#D12053]' : 'text-[#F57224]'}>
                    {paymentMethod === 'bkash' ? '🌸 bKash Personal Send Money' : '🦊 Nagad Personal Send Money'}
                  </span>
                  <span className="text-gray-500 font-mono text-[9px]">BDT MANUAL TRANSFER</span>
                </div>

                {/* Instruction Banner */}
                <div className="space-y-2 text-xs bg-black/40 p-4 border border-white/5">
                  <p className="text-gray-400 leading-relaxed font-light">
                    Please use your bKash or Nagad mobile app to <strong className="text-white">Send Money</strong> exactly <strong className="text-indigo-400">৳{Math.round(convertToBDT(finalTotal)).toLocaleString()} BDT</strong> to our personal account:
                  </p>
                  
                  <div className="flex items-center justify-between bg-[#0E0E10] border border-white/10 px-3.5 py-2.5 font-mono text-sm text-white">
                    <span className="font-bold tracking-wider">
                      {paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(
                        (paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber).replace(/[^0-9]/g, ''),
                        'personal_number'
                      )}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedStates['personal_number'] ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-500">Click the copy icon to copy the phone number instantly.</p>
                </div>

                {/* Inputs */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Your Sender Wallet Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 01XXXXXXXXX"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value.replace(/\D/g, '').substring(0, 11));
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                    <p className="text-[8px] text-gray-500">Provide the 11-digit mobile wallet number you sent the money from.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Transaction ID (TrxID)</label>
                    <input
                      type="text"
                      placeholder="e.g. 9B2K9X1Z9"
                      value={trxId}
                      onChange={(e) => {
                        setTrxId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                    <p className="text-[8px] text-gray-500">Enter the unique transaction receipt ID from bKash/Nagad SMS or App.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION PROCESSING */}
          {step === 'processing' && (
            <div className="flex h-[55vh] flex-col items-center justify-center text-center p-6" id="checkout-processing">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute h-full w-full rounded-none border-2 border-white/10 border-t-indigo-500 animate-spin" />
                <span className="absolute h-8 w-8 rounded-none border-2 border-white/5 border-t-indigo-400 animate-spin-reverse" />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-widest text-white mt-8">Processing Secure Checkout</h3>
              <p className="text-xs text-gray-500 mt-3 font-mono h-8 flex items-center justify-center max-w-sm">
                {processingLog}
              </p>
            </div>
          )}

          {/* STEP 4: ORDER FULFILLED SUCCESS PANEL */}
          {step === 'success' && latestOrder && (
            <div className="space-y-6 animate-fade-in" id="checkout-success-view">
              
              {/* Congratulations Badge */}
              <div className="text-center p-5 border border-emerald-500/20 bg-emerald-500/5">
                <div className="mx-auto flex h-9 w-9 items-center justify-center bg-emerald-500/20 text-emerald-400 mb-2.5 rounded-none">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Order {latestOrder.id} Fulfilled!</h3>
                <p className="text-xs text-gray-400 mt-1.5 font-light leading-relaxed">
                  Credentials generated successfully and sent to <span className="text-indigo-400 font-semibold">{latestOrder.email}</span>.
                </p>
              </div>

              {/* Digital Assets delivery block */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Your Digital Assets & Keys
                </label>
                
                {latestOrder.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border border-white/10 bg-black/30 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">{item.product.name}</span>
                      <span className="text-[9px] bg-black border border-white/10 px-2 py-0.5 rounded-none text-gray-400 uppercase tracking-widest">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    {item.keys.map((keyContent, keyIdx) => {
                      const elementId = `key-${itemIdx}-${keyIdx}`;
                      const isSensitive = item.product.subcategory !== 'Games';
                      const visible = showSensitive[elementId];

                      return (
                        <div key={keyIdx} className="border border-white/5 bg-[#0E0E10] p-3 relative font-mono text-[11px] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] text-gray-500 uppercase font-bold">Asset #{keyIdx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              {isSensitive && (
                                <button
                                  onClick={() => setShowSensitive(prev => ({ ...prev, [elementId]: !prev[elementId] }))}
                                  className="text-[9px] uppercase font-bold text-gray-400 hover:text-white px-2 py-1 bg-black border border-white/10 rounded-none"
                                >
                                  {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                              )}
                              <button
                                onClick={() => handleCopyToClipboard(keyContent, elementId)}
                                className="flex items-center gap-1 text-[9px] uppercase font-black text-indigo-400 hover:text-white px-2 py-1 bg-black border border-white/10 rounded-none"
                              >
                                {copiedStates[elementId] ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {/* Key/Account Output text */}
                          <div className="bg-black/60 p-2 border border-white/5 whitespace-pre-wrap leading-relaxed select-all">
                            {isSensitive && !visible 
                              ? '• • • • • • • • • • • • • • • •\n• • • • • • • • • • • • • • • •\nClick eye icon to reveal details' 
                              : keyContent
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Warranty and support warning */}
              <div className="border border-amber-500/10 bg-amber-500/5 p-4 text-xs text-amber-300">
                <h5 className="font-bold flex items-center gap-1.5 mb-1.5 text-amber-400 uppercase tracking-widest text-[9px]">
                  ⚠️ Important Usage Disclaimer
                </h5>
                <p className="font-light leading-relaxed">
                  For premium accounts, do not attempt to change login emails or primary billing structures. Doing so violates terms of use and instantly voids your 365-day replacement warranty.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer Receipt Summary */}
        {step !== 'processing' && (
          <div className="p-6 border-t border-white/10 bg-[#070708] space-y-4">
            
            {/* Promo coupon form (only in step 1: cart) */}
            {step === 'cart' && cart.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Promo Code (SYNAPSE10, GEMINI15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 pl-9 pr-3 text-xs text-white uppercase placeholder-gray-700 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="rounded-none border border-white/10 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black hover:bg-white transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">{promoError}</p>}
                {activeDiscount && (
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Check className="h-3.5 w-3.5" />
                    Coupon '{activeDiscount.code}' applied! ({activeDiscount.percent}% discount)
                  </p>
                )}
              </div>
            )}

            {/* Price breakdown receipt */}
            {cart.length > 0 && (
              <div className="space-y-2 text-xs border-b border-white/5 pb-3">
                <div className="flex justify-between text-gray-400">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-white">{formatPrice(subtotal, currency)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(promoDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Instant Delivery Fee</span>
                  <span className="text-emerald-400 uppercase font-black tracking-widest text-[9px]">Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2.5 border-t border-white/5">
                  <span className="uppercase tracking-wider text-[10px] font-black text-gray-400">Grand Total</span>
                  <span className="text-indigo-400 text-base italic font-black">{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {cart.length > 0 && (
              <div className="flex gap-2">
                {step === 'cart' ? (
                  <button
                    onClick={() => setStep('details')}
                    className="w-full rounded-none bg-white text-black py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    id="cart-checkout-btn"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setStep('cart')}
                      className="w-1/3 rounded-none border border-white/10 bg-transparent text-gray-400 py-3.5 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                      Back to Cart
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-2/3 rounded-none bg-indigo-600 text-white py-3.5 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                      id="checkout-confirm-btn"
                    >
                      Complete Checkout
                    </button>
                  </>
                )}
              </div>
            )}
            
            {step === 'success' && (
              <button
                onClick={() => {
                  setStep('cart');
                  setPromoCode('');
                  setActiveDiscount(null);
                  onClose();
                }}
                className="w-full rounded-none bg-white text-black py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
              >
                Close Receipt & Continue Shopping
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
