/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Clock, Key, Star, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Product, Review } from '../types';
import { REVIEWS } from '../data';
import { formatPrice, CurrencyType } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  currentUser: { email: string; role: 'customer' | 'admin'; name?: string } | null;
  currency: CurrencyType;
  onOpenAuth: () => void;
}

type TabType = 'overview' | 'guide' | 'reviews';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  currentUser,
  currency,
  onOpenAuth
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Load reviews from local storage, merge them with REVIEWS from data
  const [localReviews, setLocalReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('synapse_reviews_v1');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('synapse_reviews_v1', JSON.stringify(REVIEWS));
    return REVIEWS;
  });

  // Keep localReviews state in sync if admin deletes them
  useEffect(() => {
    const syncReviews = () => {
      const saved = localStorage.getItem('synapse_reviews_v1');
      if (saved) setLocalReviews(JSON.parse(saved));
    };
    window.addEventListener('synapse_reviews_updated', syncReviews);
    return () => window.removeEventListener('synapse_reviews_updated', syncReviews);
  }, []);

  if (!product) return null;

  const {
    name,
    subcategory,
    price,
    originalPrice,
    stockStatus,
    image,
    description,
    features,
    deliveryTime,
    duration,
    instructions,
    specs
  } = product;

  // Filter or assign mock reviews specific to subcategory or exact product
  const productReviews = localReviews.filter(r => {
    if ((r as any).productId === product.id) return true;
    if (subcategory === 'Netflix' && r.username.includes('cyber')) return true;
    if (subcategory === 'VPN' && r.username.includes('read')) return true;
    if (subcategory === 'Games' && r.username.includes('warrior')) return true;
    if (subcategory === 'Amazon Prime' && r.username.includes('lucas')) return true;
    return false;
  });

  // If no specific reviews, display two arbitrary ones
  const reviewsToDisplay = productReviews.length > 0 ? productReviews : localReviews.slice(0, 2);

  const discountAmount = originalPrice - price;
  const discountPercent = Math.round((discountAmount / originalPrice) * 100);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!currentUser) {
      setReviewError('You must be logged in to post a review.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Review comment cannot be empty.');
      return;
    }

    const newReview: Review = {
      id: 'rev-' + Math.floor(1000 + Math.random() * 9000),
      username: currentUser.name || currentUser.email.split('@')[0],
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`
    };
    // Tag with current product ID so it only appears for this specific item
    (newReview as any).productId = product.id;

    const updated = [newReview, ...localReviews];
    setLocalReviews(updated);
    localStorage.setItem('synapse_reviews_v1', JSON.stringify(updated));
    
    // Notify Admin Panel
    window.dispatchEvent(new Event('synapse_reviews_updated'));

    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess('Verified review submitted successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in" id="product-detail-modal">
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-none border border-white/15 bg-[#0E0E10] shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-none bg-black border border-white/10 text-gray-400 hover:text-black hover:bg-white focus:outline-none transition-colors"
          id="modal-close-btn"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Left Side: Product Art/Banner */}
        <div className="w-full md:w-5/12 relative aspect-video md:aspect-auto md:min-h-full bg-black">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${product.id}/800/1200`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-transparent to-transparent" />
          
          {/* Badge Overlays on Left Art */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <span className="inline-flex items-center gap-1.5 border border-indigo-500/20 bg-black/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-400">
              <Key className="h-3 w-3 text-indigo-400" />
              <span>Instant Digital Delivery</span>
            </span>
            <div className="text-[11px] text-gray-300 font-light bg-black/80 p-4 border border-white/15 backdrop-blur-sm leading-relaxed">
              <Clock className="inline h-3.5 w-3.5 text-indigo-400 mr-2 shrink-0 align-middle" />
              <span>Delivered instantly and emailed to you directly.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Details */}
        <div className="w-full md:w-7/12 flex flex-col overflow-hidden max-h-[60vh] md:max-h-[90vh]">
          
          {/* Header Details */}
          <div className="p-8 pb-4 border-b border-white/10 bg-[#0E0E10]">
            <div className="flex items-center gap-2">
              <span className="border border-indigo-500/25 bg-indigo-500/5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                {subcategory}
              </span>
              {duration && (
                <span className="border border-white/15 bg-white/5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-gray-300">
                  {duration} Plan
                </span>
              )}
            </div>
            <h2 className="mt-3 text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
              {name}
            </h2>
            
            {/* Tab Controllers */}
            <div className="mt-6 flex gap-1 border-b border-white/10">
              {(['overview', 'guide', 'reviews'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-400 font-black'
                      : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                  id={`tab-btn-${tab}`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'guide' && 'Activation Guide'}
                  {tab === 'reviews' && `Reviews (${product.reviewsCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Body Contents */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product Description</h4>
                  <p className="mt-2.5 text-xs text-gray-300 leading-relaxed font-light">
                    {description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3.5">Key Features & Inclusions</h4>
                  <ul className="grid gap-2.5 text-xs text-gray-300 font-light">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {specs && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3.5">Technical Specifications</h4>
                    <div className="overflow-hidden rounded-none border border-white/10 bg-black/30">
                      <table className="w-full text-left text-xs border-collapse">
                        <tbody>
                          {Object.entries(specs).map(([key, value], idx) => (
                            <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-gray-400 w-1/3 uppercase tracking-wider text-[9px]">{key}</td>
                              <td className="p-3 text-gray-200 font-light text-xs">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-5 animate-fade-in">
                <div className="border border-indigo-500/10 bg-indigo-500/5 p-4 text-xs text-indigo-300">
                  <h5 className="font-bold flex items-center gap-1.5 mb-1.5 text-indigo-400 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" />
                    Automated Secure Delivery Invariant
                  </h5>
                  Our licensing server generates these accounts and CD-Keys upon successful transaction receipt. Follow the guide below to claim and activate without issues.
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">How to Claim & Activate</h4>
                <div className="relative border-l border-white/10 pl-5 ml-2 space-y-6">
                  {instructions.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[29px] top-0 flex h-4 w-4 items-center justify-center rounded-none bg-black border border-white/15 text-[9px] font-bold text-indigo-400">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed pl-1.5 font-light">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Micro Guarantee Banner */}
                <div className="flex items-center gap-3.5 border border-white/10 bg-[#0E0E10]/80 p-4">
                  <div className="flex h-9 w-9 items-center justify-center bg-indigo-500/10 text-indigo-400">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wider">Full-Duration Warranty Coverage</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-light">This product is covered by a 100% replacement warranty for its entire activation duration.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified Buyer Reviews</h4>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">({reviewsToDisplay.length} verified ratings)</span>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {reviewsToDisplay.map((rev) => (
                    <div key={rev.id} className="border border-white/5 bg-black/25 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.avatar}
                            alt={rev.username}
                            className="h-8 w-8 rounded-none object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = `https://picsum.photos/seed/${rev.username}/100/100`;
                            }}
                          />
                          <div>
                            <div className="text-[11px] font-black text-white">@{rev.username}</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{rev.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-300 leading-relaxed font-light italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* WRITE A REVIEW SUBSECTION */}
                <div className="border-t border-white/10 pt-5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Submit Verified Review</span>
                  </h4>

                  {currentUser ? (
                    <form onSubmit={handleAddReviewSubmit} className="space-y-3 bg-black/40 p-4 border border-white/5">
                      {reviewError && (
                        <div className="border border-rose-500/20 bg-rose-500/5 p-3 text-[9px] font-bold text-rose-400 uppercase tracking-wide">
                          ⚠️ Error: {reviewError}
                        </div>
                      )}
                      {reviewSuccess && (
                        <div className="border border-emerald-500/20 bg-emerald-500/5 p-3 text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
                          ✓ {reviewSuccess}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Star Rating:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              <Star 
                                className={`h-4.5 w-4.5 ${
                                  star <= reviewRating 
                                    ? 'fill-amber-500 text-amber-500' 
                                    : 'text-gray-600 hover:text-amber-500'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <textarea
                          rows={2}
                          required
                          placeholder="Share your experience with this license key or stream profile..."
                          value={reviewComment}
                          onChange={(e) => {
                            setReviewComment(e.target.value);
                            if (reviewError) setReviewError('');
                          }}
                          className="w-full rounded-none border border-white/10 bg-black py-2 px-3 text-xs text-white placeholder-gray-800 focus:border-indigo-500 focus:outline-none font-light resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-none bg-white text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <Send className="h-3 w-3" />
                        <span>Publish Review</span>
                      </button>
                    </form>
                  ) : (
                    <div className="border border-white/5 bg-black/40 p-5 text-center space-y-3">
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Only verified buyers with a synchronized node can leave reviews. Please verify your customer login credentials to write a review.
                      </p>
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="inline-flex items-center gap-1.5 border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-[9px] uppercase font-black tracking-widest text-indigo-400 hover:bg-white hover:text-black hover:border-white transition-all rounded-none focus:outline-none"
                      >
                        Verify Credentials
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Footer Checkout Bar */}
          <div className="p-6 border-t border-white/10 bg-[#070708] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Pricing Policy</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-white italic">
                  {formatPrice(price, currency)}
                </span>
                {originalPrice > price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice, currency)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={stockStatus === 'out_of_stock'}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-none ${
                  stockStatus === 'out_of_stock'
                    ? 'bg-transparent border border-white/10 text-gray-600 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                }`}
                id="modal-add-to-cart-btn"
              >
                <span>Add to Shopping Cart</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
