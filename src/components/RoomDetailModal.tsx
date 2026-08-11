import React, { useState } from 'react';
import { X, Star, Users, Maximize2, Bed, Check, ShieldCheck, Sparkles, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { Room, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  onProceedToBooking: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  currentCurrency,
  onProceedToBooking,
}) => {
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-4xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 shadow-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
              <img
                src={room.images[activeImageIndex]}
                alt={room.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                {room.category}
              </div>
            </div>

            {/* Thumbnail Row */}
            {room.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Headline */}
          <div className="border-b border-white/10 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {room.name}
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{room.rating.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({room.reviewCount} verified reviews)</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 font-light leading-relaxed">
              {room.tagline}
            </p>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Occupancy</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Up to {room.capacity.adults + room.capacity.children} guests
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Room Dimensions</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4" /> {room.sizeSqm} m² / {Math.round(room.sizeSqm * 10.764)} sq ft
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Bed Layout</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 truncate">
                <Bed className="w-4 h-4 shrink-0" /> {room.bedType}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Cancellation</span>
              <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {room.cancellationPolicy}
              </span>
            </div>
          </div>

          {/* Suite Story Description */}
          <div className="space-y-2">
            <h3 className="text-base font-serif font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> About This Suite
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {room.description}
            </p>
          </div>

          {/* Premium Amenities Checklist */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-white">Included Luxury Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Reviews Section */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Guest Testimonials
            </h3>
            <div className="space-y-3">
              {room.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={rev.author}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{rev.author}</h4>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Nightly Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                {formatPrice(room.pricePerNight, currentCurrency)}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ night</span>
            </div>
          </div>

          <button
            id={`modal-book-btn-${room.id}`}
            onClick={() => {
              onClose();
              onProceedToBooking(room);
            }}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Reserve Suite Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
