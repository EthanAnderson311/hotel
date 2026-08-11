import React from 'react';
import { Calendar, Users, Search, Sparkles, MapPin, Award, Star } from 'lucide-react';
import heroImg from '../assets/images/ung_chhayarith_resort_hero_1786429859989.jpg';
import { RoomCategory } from '../types';

interface HeroProps {
  checkInDate: string;
  setCheckInDate: (d: string) => void;
  checkOutDate: string;
  setCheckOutDate: (d: string) => void;
  adultsCount: number;
  setAdultsCount: (n: number) => void;
  childrenCount: number;
  setChildrenCount: (n: number) => void;
  selectedCategory: RoomCategory;
  setSelectedCategory: (cat: RoomCategory) => void;
  onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  adultsCount,
  setAdultsCount,
  childrenCount,
  setChildrenCount,
  selectedCategory,
  setSelectedCategory,
  onSearch,
}) => {
  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background Hero Image */}
      <img
        src={heroImg}
        alt="Ung Chhayarith Hotel & Resort Oceanfront View"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
      />

      {/* Glass Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-[#020617]/40" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#020617]/30 to-[#020617]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-lg">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Voted #1 Coastal Luxury Resort 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold backdrop-blur-xl shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Sanctuary Bay Peninsula
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-lg">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            5-Star World Luxury Rating
          </span>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-4 leading-tight">
            Experience Timeless Luxury at <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-500">
              Ung Chhayarith
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Where pristine oceanviews meet bespoke 24/7 butler service, private plunge pool villas, and Michelin-inspired culinary artistry.
          </p>
        </div>

        {/* Responsive Reservation Search Bar - Frosted Glass Container */}
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Check-In / Check-Out */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-In Date
              </label>
              <input
                id="search-check-in-date"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-Out Date
              </label>
              <input
                id="search-check-out-date"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {/* Guest Count */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Guests
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  id="search-adults-count"
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Number(e.target.value))}
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  {[1, 2, 3, 4, 6].map((n) => (
                    <option key={n} value={n} className="bg-slate-900 text-white">
                      {n} Adult{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <select
                  id="search-children-count"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n} className="bg-slate-900 text-white">
                      {n} Child{n !== 1 ? 'ren' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Category */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Suite Category
              </label>
              <select
                id="search-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as RoomCategory)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
              >
                <option value="All" className="bg-slate-900 text-white">All Categories</option>
                <option value="Suite" className="bg-slate-900 text-white">Suites</option>
                <option value="Villa" className="bg-slate-900 text-white">Private Villas</option>
                <option value="Penthouse" className="bg-slate-900 text-white">Penthouses</option>
                <option value="Deluxe" className="bg-slate-900 text-white">Deluxe Rooms</option>
              </select>
            </div>
          </div>

          {/* Search Trigger CTA */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-time availability guaranteed • Instant automated email confirmation</span>
            </div>
            <button
              id="search-suites-btn"
              onClick={onSearch}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Suites</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
