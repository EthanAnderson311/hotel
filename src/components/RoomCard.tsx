import React from 'react';
import { Star, Users, Maximize2, ShieldCheck, Eye, ArrowRight, Bed, Sparkles } from 'lucide-react';
import { Room, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface RoomCardProps {
  room: Room;
  currentCurrency: CurrencyCode;
  onQuickView: (room: Room) => void;
  onBookNow: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  currentCurrency,
  onQuickView,
  onBookNow,
}) => {
  return (
    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Room Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-950">
        <img
          src={room.images[0]}
          alt={room.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase shadow-lg">
            {room.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 shadow-lg">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {room.cancellationPolicy}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{room.rating.toFixed(2)}</span>
          <span className="text-slate-400 text-[10px]">({room.reviewCount})</span>
        </div>

        {/* Floating View Tag */}
        <div className="absolute bottom-3 left-4 text-xs font-medium text-emerald-200/90 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          📍 {room.view}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-emerald-400 transition-colors">
            {room.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {room.tagline}
          </p>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 my-4 p-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
            <div className="flex items-center gap-1.5 justify-center">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{room.capacity.adults} Guests</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-white/10">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{room.sizeSqm} m²</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center truncate">
              <Bed className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{room.bedType.split(' ')[1] || 'King'}</span>
            </div>
          </div>

          {/* Popular Features Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {room.popularFeatures.slice(0, 3).map((feat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-300 text-[11px] font-medium border border-white/10"
              >
                ✦ {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & CTAs */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-bold font-serif text-emerald-400">
              {formatPrice(room.pricePerNight, currentCurrency)}
            </span>
            <span className="text-xs text-slate-400 block font-normal">per night + tax</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`quick-view-${room.id}`}
              onClick={() => onQuickView(room)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
              title="Quick Suite Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              id={`book-now-${room.id}`}
              onClick={() => onBookNow(room)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Book Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
