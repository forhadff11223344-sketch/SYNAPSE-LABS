/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, ShoppingCart, Info, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { MouseEvent } from 'react';
import { formatPrice, CurrencyType } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, e: MouseEvent) => void;
  currency: CurrencyType;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  currency
}: ProductCardProps) {
  const {
    name,
    subcategory,
    price,
    originalPrice,
    rating,
    reviewsCount,
    stockStatus,
    image,
    duration
  } = product;

  // Stock badge helper
  const renderStockBadge = () => {
    switch (stockStatus) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 rounded-none">
            <span>In Stock</span>
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400 rounded-none">
            <span>Low Stock</span>
          </span>
        );
      case 'out_of_stock':
      default:
        return (
          <span className="inline-flex items-center gap-1 border border-rose-500/20 bg-rose-500/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-rose-400 rounded-none">
            <span>Sold Out</span>
          </span>
        );
    }
  };

  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col overflow-hidden rounded-none border border-white/10 bg-[#0E0E10] transition-all duration-200 hover:border-white/25 hover:bg-white/[0.02] cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute left-0 top-0 z-10 bg-rose-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white">
          -{discountPercentage}% OFF
        </span>
      )}

      {/* Duration Badge */}
      {duration && (
        <span className="absolute right-0 top-0 z-10 bg-black/95 border-b border-l border-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
          {duration}
        </span>
      )}

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-black border-b border-white/10">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Placeholder in case of CDN failures
            e.currentTarget.src = `https://picsum.photos/seed/${product.id}/600/400`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
            {subcategory}
          </span>
          {renderStockBadge()}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold uppercase tracking-tight text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>

        {/* Rating Row */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-[11px] font-bold text-gray-300">{rating}</span>
          <span className="text-[10px] text-gray-500">({reviewsCount} Index)</span>
        </div>

        {/* Specs snippet */}
        <p className="mt-4 text-xs text-gray-400 leading-relaxed font-light line-clamp-2">
          {product.description}
        </p>

        {/* Price and Action Section */}
        <div className="mt-8 pt-5 flex items-center justify-between gap-3 border-t border-white/10">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white italic">
                {formatPrice(price, currency)}
              </span>
              {originalPrice > price && (
                <span className="text-[11px] text-gray-500 line-through">
                  {formatPrice(originalPrice, currency)}
                </span>
              )}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5 font-bold">Auto Release</div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="flex h-9 w-9 items-center justify-center border border-white/10 bg-transparent text-gray-400 transition-all hover:border-white hover:text-white rounded-none"
              title="View Activation Steps"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              disabled={stockStatus === 'out_of_stock'}
              onClick={(e) => onAddToCart(product, e)}
              className={`flex h-9 items-center justify-center gap-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-none ${
                stockStatus === 'out_of_stock'
                  ? 'bg-transparent border border-white/10 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
