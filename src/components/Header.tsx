/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, Key, HelpCircle, Flame, User, LogOut, Settings, DollarSign } from 'lucide-react';
import { CartItem } from '../types';
import { CurrencyType } from '../utils/currency';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSupport: () => void;
  onResetFilters: () => void;
  currentUser: { email: string; role: 'customer' | 'admin'; name?: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

export default function Header({
  cart,
  onOpenCart,
  onOpenSupport,
  onResetFilters,
  currentUser,
  onOpenAuth,
  onLogout,
  isAdminView,
  setIsAdminView
}: HeaderProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0B]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => {
            setIsAdminView(false);
            onResetFilters();
          }}
          className="flex cursor-pointer items-center gap-3 transition-colors hover:text-indigo-400"
          id="brand-logo"
        >
          <div className="relative flex h-8 w-8 items-center justify-center bg-indigo-600 rounded-none font-bold text-black italic text-xl select-none">
            S
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="text-lg font-black tracking-tighter uppercase text-white font-sans">
              SYNAPSE
            </span>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 sm:ml-1.5 uppercase">
              LABS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Admin console button (only visible to admins) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={`flex items-center gap-1.5 border px-3 py-2 text-[9px] uppercase font-black tracking-widest transition-all rounded-none ${
                isAdminView 
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-400' 
                  : 'border-white/10 text-red-400 hover:bg-white hover:text-black hover:border-white'
              }`}
            >
              <Settings className="h-3 w-3 animate-spin" />
              <span>{isAdminView ? 'Storefront' : 'Admin Area'}</span>
            </button>
          )}

          {/* FAQ & Support Trigger */}
          {!isAdminView && (
            <button
              onClick={onOpenSupport}
              className="flex items-center gap-2 border border-white/10 bg-transparent px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-gray-300 transition-all hover:bg-white hover:text-black hover:border-white focus:outline-none rounded-none"
              id="nav-btn-support"
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-black transition-colors" />
              <span className="hidden sm:inline">Support</span>
            </button>
          )}

          {/* Cart Trigger */}
          {!isAdminView && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center border border-white/15 bg-white text-black p-2.5 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 focus:outline-none rounded-none"
              id="nav-btn-cart"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center bg-indigo-600 text-[9px] font-black text-white outline outline-2 outline-[#0A0A0B]">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Auth Button */}
          <div className="flex items-center border-l border-white/10 pl-2 sm:pl-4 gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">{currentUser.name || 'User'}</span>
                  <span className="text-[8px] text-gray-500 font-mono">{currentUser.role === 'admin' ? 'SEC_ADMIN' : 'CUSTOMER'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 border border-white/10 bg-transparent text-gray-400 hover:text-rose-400 hover:border-rose-400 rounded-none transition-all"
                  title="Logout Session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 border border-indigo-600/30 bg-indigo-600/5 px-3 py-2 text-[9px] uppercase font-black tracking-widest text-indigo-400 hover:bg-white hover:text-black hover:border-white transition-all rounded-none"
              >
                <User className="h-3.5 w-3.5" />
                <span>Verify</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
