/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { X, HelpCircle, MessageSquare, Send, CheckCircle2, ChevronDown, ShieldAlert, BadgeInfo, MessageCircle, Globe, Facebook } from 'lucide-react';
import { FAQS, DEFAULT_GATEWAY_SETTINGS } from '../data';
import { GatewaySettings } from '../types';

interface SupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportWidget({ isOpen, onClose }: SupportWidgetProps) {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketTopic, setTicketTopic] = useState('Replacement');
  const [ticketMsg, setTicketMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [settings, setSettings] = useState<GatewaySettings>(DEFAULT_GATEWAY_SETTINGS);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('synapse_gateway_settings_v1');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse gateway settings in SupportWidget', e);
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

  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!ticketName || !ticketEmail || !ticketMsg) {
      setErrorMessage('Please fill out all support ticket fields.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);

      // Save ticket to local storage for Admin Panel access
      const newTicket = {
        id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
        name: ticketName,
        email: ticketEmail,
        topic: ticketTopic,
        message: ticketMsg,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'open'
      };

      try {
        const existingTickets = JSON.parse(localStorage.getItem('synapse_tickets_v1') || '[]');
        existingTickets.unshift(newTicket);
        localStorage.setItem('synapse_tickets_v1', JSON.stringify(existingTickets));
        
        // Notify any observers (e.g., Admin Panel) that state changed
        window.dispatchEvent(new Event('synapse_tickets_updated'));
      } catch (err) {
        console.error('Failed to save ticket', err);
      }

      let reply = '';
      if (ticketTopic === 'Replacement') {
        reply = `Hello ${ticketName}, thank you for contacting Synapse Labs Support. We have received your query regarding account/key replacement. Our automatic licensing verification shows your request has been logged. A support specialist will check your credentials and email you a replacement within 15-30 minutes if any issues are detected.`;
      } else if (ticketTopic === 'Payment') {
        reply = `Hello ${ticketName}, our billing gateway logs show we are awaiting network confirmations. If you paid via Crypto, please ensure at least 2 confirmations on the blockchain. Once confirmed, your products are automatically released. We have logged this ticket as high priority!`;
      } else {
        reply = `Hello ${ticketName}, thank you for reaching out to Synapse Labs. We have successfully logged your ticket regarding "${ticketTopic}". One of our support engineers will review your message and reply via email at ${ticketEmail} shortly.`;
      }
      setTicketResult(reply);
      
      // Clear inputs
      setTicketName('');
      setTicketEmail('');
      setTicketMsg('');
    }, 1200);
  };

  const toggleFAQ = (idx: number) => {
    setOpenFAQIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="support-modal">
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-none border border-white/10 bg-[#0E0E10] shadow-2xl max-h-[85vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-gray-400 hover:text-black p-2 rounded-none hover:bg-white focus:outline-none transition-all border border-transparent hover:border-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left column: FAQ accordion */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[40vh] md:max-h-[85vh] border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5 mb-5">
            <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Frequently Asked Questions</h3>
          </div>
          
          <div className="space-y-3.5" id="faq-accordion-group">
            {FAQS.map((faq, idx) => {
              const isOpen = openFAQIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-none border border-white/10 bg-black/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3 animate-slide-down">
                      <p className="font-light">{faq.answer}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                        <BadgeInfo className="h-3 w-3 text-gray-600" />
                        <span>Category: {faq.category}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Outreach Links */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Direct Support Nodes</span>
            <div className="grid grid-cols-3 gap-2">
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 border border-white/5 bg-black/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-center group"
                id="support-direct-whatsapp"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">WhatsApp</span>
                <span className="text-[7px] text-gray-500 mt-0.5 font-mono truncate max-w-full">{settings.whatsappNumber}</span>
              </a>

              <a 
                href={settings.discordLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 border border-white/5 bg-black/40 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-center group"
                id="support-direct-discord"
              >
                <Globe className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Discord</span>
                <span className="text-[7px] text-gray-500 mt-0.5 font-mono truncate max-w-full">Join server</span>
              </a>

              <a 
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 border border-white/5 bg-black/40 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all text-center group"
                id="support-direct-facebook"
              >
                <Facebook className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Facebook</span>
                <span className="text-[7px] text-gray-500 mt-0.5 font-mono truncate max-w-full">Outreach</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right column: Ticket submission */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[45vh] md:max-h-[85vh] flex flex-col justify-between bg-[#0E0E10]">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Create Support Ticket</h3>
            </div>

            {errorMessage && (
              <div className="border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400 font-bold uppercase tracking-wide mb-4">
                ⚠️ Error: {errorMessage}
              </div>
            )}

            {ticketResult ? (
              <div className="flex flex-col justify-center text-center p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-none space-y-4 animate-fade-in">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-none bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-2.5 p-3.5 bg-black/60 rounded-none border border-white/5 font-light">
                    {ticketResult}
                  </p>
                </div>
                <button
                  onClick={() => setTicketResult(null)}
                  className="mt-4 rounded-none border border-white/10 bg-black hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest text-gray-300 py-3 transition-all w-full"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      value={ticketName}
                      onChange={(e) => {
                        setTicketName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-850 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={ticketEmail}
                      onChange={(e) => {
                        setTicketEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-850 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Topic selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select Ticket Topic</label>
                  <div className="relative">
                    <select
                      value={ticketTopic}
                      onChange={(e) => setTicketTopic(e.target.value)}
                      className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white cursor-pointer focus:border-indigo-500 focus:outline-none appearance-none"
                    >
                      <option value="Replacement">Account Login / Key Replacement</option>
                      <option value="Payment">Payment / Crypto Confirmation</option>
                      <option value="Inquiry">General Product Inquiry</option>
                      <option value="Partnership">Business / Wholesale Key Offer</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Inquiry Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue or question in detail. Please provide Order ID if applicable."
                    value={ticketMsg}
                    onChange={(e) => {
                      setTicketMsg(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full rounded-none border border-white/10 bg-black py-2.5 px-3 text-xs text-white placeholder-gray-700 focus:border-indigo-500 focus:outline-none resize-none font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white disabled:opacity-55 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-black border-t-white rounded-none animate-spin" />
                      <span>Transmitting Support Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Secure Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Secure Support Disclaimer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-wider font-bold leading-relaxed">
            <ShieldAlert className="h-4 w-4 text-gray-600 shrink-0" />
            <span>End-to-end encrypted ticket logs. Average response: ~12 minutes.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
