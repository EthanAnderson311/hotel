import React, { useState } from 'react';
import { Mail, Phone, MapPin, Award, ShieldCheck, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-slate-950/60 backdrop-blur-xl border-t border-white/10 text-slate-300 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-serif font-bold text-slate-950 text-lg shadow-lg border border-white/20">
                UC
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Ung <span className="text-emerald-400">Chhayarith</span></h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Hotel & Resort</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              An international benchmark for luxury hospitality, coastal elegance, and personalized butler services.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>World Luxury Hotel Award Winner 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Rooms & Suites</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#rooms" className="hover:text-emerald-400 transition-colors">Grand Royal Oceanfront Suite</a></li>
              <li><a href="#rooms" className="hover:text-emerald-400 transition-colors">Presidential Sky Penthouse</a></li>
              <li><a href="#rooms" className="hover:text-emerald-400 transition-colors">Sanctuary Garden Spa Villa</a></li>
              <li><a href="#rooms" className="hover:text-emerald-400 transition-colors">Royal Heritage Family Villa</a></li>
              <li><a href="#rooms" className="hover:text-emerald-400 transition-colors">Deluxe Sunset Ocean Room</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Contact Concierge</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sanctuary Bay Peninsula, Coastal Highway</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+855 23 888 999 (24/7 VIP Hotline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>reservations@ungchhayarith.com</span>
              </p>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Privilege Circle</h4>
            <p className="text-xs text-slate-400">
              Subscribe to receive private villa offers, seasonal tasting menus, and spa credits.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 flex-1"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Join
                </button>
              </div>
              {newsletterSubscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Subscribed to Ung Chhayarith Club!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ung Chhayarith Hotel & Resort. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PCI-DSS Compliant Payment Gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
