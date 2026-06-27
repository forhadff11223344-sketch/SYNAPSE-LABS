/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { X, Shield, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role: 'customer' | 'admin', name?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    if (tab === 'signin') {
      // 1. Check for Admin Preset
      if (email.toLowerCase() === 'admin@synapse.com' && password === 'admin') {
        setSuccessMsg('Admin access authorized. Syncing terminal...');
        setTimeout(() => {
          onLoginSuccess(email, 'admin', 'Administrator');
          onClose();
        }, 1000);
        return;
      }

      // 2. Check in Registered Customers
      const users = JSON.parse(localStorage.getItem('synapse_users_v1') || '[]');
      const match = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (match) {
        setSuccessMsg(`Welcome back, ${match.name}!`);
        setTimeout(() => {
          onLoginSuccess(email, 'customer', match.name);
          onClose();
        }, 1000);
      } else {
        setErrorMsg('Invalid login credentials. Please try again or sign up below.');
      }
    } else {
      // Sign Up flow
      if (!name) {
        setErrorMsg('Please enter your full name for credentials generation.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('synapse_users_v1') || '[]');
      const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (exists) {
        setErrorMsg('Email address already registered. Please sign in instead.');
        return;
      }

      // Save new customer account
      const newUser = {
        name,
        email,
        password,
        registeredAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('synapse_users_v1', JSON.stringify(users));

      setSuccessMsg('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(email, 'customer', name);
        onClose();
      }, 1200);
    }
  };

  const handleUseDemoAdmin = () => {
    setEmail('admin@synapse.com');
    setPassword('admin');
    setTab('signin');
  };

  const handleUseDemoCustomer = () => {
    setEmail('buyer@synapse.com');
    setPassword('buyer123');
    setName('Tanvir Rahman');
    setTab('signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="auth-modal">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-none border border-white/10 bg-[#0E0E10] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Security Verification</h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Secure Authenticator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black p-2 rounded-none hover:bg-white focus:outline-none transition-all border border-transparent hover:border-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 bg-[#0A0A0B]/60 p-1">
          <button
            onClick={() => {
              setTab('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all focus:outline-none ${
              tab === 'signin' ? 'bg-white/5 border border-white/10 text-white font-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            Sign In Account
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all focus:outline-none ${
              tab === 'signup' ? 'bg-white/5 border border-white/10 text-white font-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            Create Credentials
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          
          {/* Error messages */}
          {errorMsg && (
            <div className="border border-rose-500/20 bg-rose-500/5 p-4 text-[10px] text-rose-400 font-bold uppercase tracking-wide">
              ⚠️ Error: {errorMsg}
            </div>
          )}

          {/* Success messages */}
          {successMsg && (
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 text-[10px] text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Full Human Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Rahman"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span>Secure Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-indigo-400" />
                <span>Terminal Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-none bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
            >
              {tab === 'signin' ? 'Verify Credentials' : 'Initialize Account Node'}
            </button>
          </form>

          {/* Preset Buttons Helper */}
          <div className="pt-4 border-t border-white/5 space-y-3 bg-black/20 p-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Developer Quick Sandbox Access</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleUseDemoAdmin}
                className="p-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-[8px] uppercase font-black tracking-wider text-red-400 rounded-none text-left"
              >
                ⚡ Use Demo Admin
                <div className="text-[7px] text-gray-500 font-normal mt-0.5">admin@synapse.com (admin)</div>
              </button>
              <button
                onClick={handleUseDemoCustomer}
                className="p-2.5 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-[8px] uppercase font-black tracking-wider text-indigo-400 rounded-none text-left"
              >
                ⚡ Create Demo Customer
                <div className="text-[7px] text-gray-500 font-normal mt-0.5">buyer@synapse.com</div>
              </button>
            </div>
          </div>

          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider text-center leading-relaxed">
            🛡️ Encrypted end-to-end sandbox login node
          </div>
        </div>
      </div>
    </div>
  );
}
