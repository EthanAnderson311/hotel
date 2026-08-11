import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Calendar, 
  User, 
  Globe, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { CurrencyCode, GuestProfile } from '../types';
import { CURRENCIES } from '../utils/currency';

interface HeaderProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  activeTab: 'explore' | 'dashboard' | 'amenities';
  onNavigateTab: (tab: 'explore' | 'dashboard' | 'amenities') => void;
  unreadEmailCount: number;
  onOpenEmailInbox: () => void;
  guestProfile: GuestProfile;
  bookingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onSelectCurrency,
  activeTab,
  onNavigateTab,
  unreadEmailCount,
  onOpenEmailInbox,
  guestProfile,
  bookingCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-2xl">
      {/* Top Announcement Bar */}
      <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 text-center text-xs font-medium text-emerald-300 border-b border-white/10 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>Welcome to <strong>Ung Chhayarith Hotel & Resort</strong> — Enjoy 15% off luxury suites with code <strong>CHHAYARITH</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { onNavigateTab('explore'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <span className="font-serif font-bold text-slate-950 text-xl tracking-tighter">UC</span>
            </div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Ung <span className="text-emerald-400">Chhayarith</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
                Hotel & Resort
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              id="nav-btn-explore"
              onClick={() => onNavigateTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white/10 text-emerald-400 border border-white/15 backdrop-blur-md shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Rooms & Suites
            </button>
            <button
              id="nav-btn-amenities"
              onClick={() => onNavigateTab('amenities')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'amenities'
                  ? 'bg-white/10 text-emerald-400 border border-white/15 backdrop-blur-md shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Resort Amenities
            </button>
            <button
              id="nav-btn-dashboard"
              onClick={() => onNavigateTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-emerald-400 border border-white/15 backdrop-blur-md shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Guest Dashboard</span>
              {bookingCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950">
                  {bookingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons & Currency Switcher */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Currency Dropdown */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 backdrop-blur-md transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{CURRENCIES[currentCurrency].code} ({CURRENCIES[currentCurrency].symbol})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1.5 z-50">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        onSelectCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-500/10 transition-colors ${
                        currentCurrency === code ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-slate-400 font-mono">{CURRENCIES[code].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Email Notification Inbox Trigger */}
            <button
              id="email-inbox-trigger"
              onClick={onOpenEmailInbox}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 backdrop-blur-md transition-all group"
              title="Automated Confirmation Emails"
            >
              <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-slate-950 animate-bounce">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md border border-white/20">
                UC
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{guestProfile.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium">{guestProfile.tier}</p>
              </div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenEmailInbox}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400"
            >
              <Mail className="w-5 h-5" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                  {unreadEmailCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                UC
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{guestProfile.name}</p>
                <p className="text-xs text-emerald-400 font-medium">{guestProfile.tier}</p>
              </div>
            </div>
            {/* Currency selector in mobile */}
            <select
              value={currentCurrency}
              onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-900 border border-white/10 text-emerald-400 text-xs rounded-lg px-2 py-1 font-semibold"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { onNavigateTab('explore'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'explore' ? 'bg-white/10 text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            Rooms & Suites
          </button>
          <button
            onClick={() => { onNavigateTab('amenities'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activeTab === 'amenities' ? 'bg-white/10 text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            Resort Amenities
          </button>
          <button
            onClick={() => { onNavigateTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'dashboard' ? 'bg-white/10 text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            <span>Guest Dashboard & Bookings</span>
            {bookingCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950">
                {bookingCount} active
              </span>
            )}
          </button>
          <button
            onClick={() => { onOpenEmailInbox(); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-emerald-400 bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              Confirmation Email Inbox
            </span>
            {unreadEmailCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950">
                {unreadEmailCount} unread
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
