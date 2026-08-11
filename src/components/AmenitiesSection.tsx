import React from 'react';
import { 
  Utensils, 
  Waves, 
  Sparkles, 
  HeartHandshake, 
  Plane, 
  Wine, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';

export const AmenitiesSection: React.FC = () => {
  const amenities = [
    {
      icon: Waves,
      title: 'Horizon Infinity Pool',
      desc: ' Heated saltwater pool floating directly over the ocean line with luxury cabanas.',
    },
    {
      icon: Utensils,
      title: 'Michelin Culinary Artistry',
      desc: '3 fine-dining restaurants featuring authentic Cambodian royal cuisine & seafood.',
    },
    {
      icon: HeartHandshake,
      title: '24/7 Personal Butler Service',
      desc: 'Dedicated concierge for suite guests to organize excursions, packing, and dining.',
    },
    {
      icon: Sparkles,
      title: 'Lotus Flower Spa Sanctuary',
      desc: 'Aromatherapy steam rooms, deep tissue massage, and private hot stone Jacuzzi.',
    },
    {
      icon: Plane,
      title: 'Private Helipad & Limousine',
      desc: 'Chauffeur-driven Rolls-Royce airport transfers and private helicopter charters.',
    },
    {
      icon: Wine,
      title: 'Sunset Sommelier Lounge',
      desc: 'Exclusive wine cellar with vintage selections and sunset mixology performances.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-slate-100">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block">
          Ung Chhayarith Resort & Spa
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          Unrivaled Luxury Amenities
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Curated for the world's most discerning travelers. Every moment at Ung Chhayarith is designed to inspire tranquility and joy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 shadow-xl transition-all duration-300 space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
