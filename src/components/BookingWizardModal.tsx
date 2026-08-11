import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Gift, 
  CheckCircle2, 
  Mail, 
  QrCode, 
  Download,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Room, Booking, BookingAddOn, CurrencyCode, PaymentDetails } from '../types';
import { MOCK_ADD_ONS } from '../data/mockRooms';
import { formatPrice } from '../utils/currency';

interface BookingWizardModalProps {
  room: Room | null;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  initialCheckIn: string;
  initialCheckOut: string;
  initialAdults: number;
  initialChildren: number;
  onBookingCompleted: (booking: Booking) => void;
  onOpenEmailInbox: () => void;
  onNavigateToDashboard: () => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  room,
  onClose,
  currentCurrency,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  onBookingCompleted,
  onOpenEmailInbox,
  onNavigateToDashboard,
}) => {
  if (!room) return null;

  // Step state (1: Specs & Add-ons, 2: Guest Details, 3: Payment Gateway, 4: Confirmed)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dates & Guests
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);

  // Selected Add-ons
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['addon-2']);

  // Guest Details
  const [fullName, setFullName] = useState('Ung Chhayarith');
  const [email, setEmail] = useState('chhayarithung855@gmail.com');
  const [phone, setPhone] = useState('+855 12 345 678');
  const [specialRequests, setSpecialRequests] = useState('Ocean view high floor preferred.');
  const [estimatedArrival, setEstimatedArrival] = useState('15:00');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay' | 'pay_at_hotel'>('card');
  const [cardHolderName, setCardHolderName] = useState('Ung Chhayarith');
  const [cardNumber, setCardNumber] = useState('4532 8892 1042 8842');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('884');

  // Promo Code
  const [promoInput, setPromoInput] = useState('CHHAYARITH');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>({ code: 'CHHAYARITH', percent: 15 });
  const [promoMessage, setPromoMessage] = useState('Promo code CHHAYARITH applied (15% off)!');

  // Processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Calculate Nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();

  // Selected AddOns array
  const selectedAddOns = MOCK_ADD_ONS.filter((a) => selectedAddOnIds.includes(a.id));

  // Calculations
  const roomSubtotal = room.pricePerNight * nights;
  const addOnsSubtotal = selectedAddOns.reduce((acc, curr) => {
    return acc + (curr.perNight ? curr.price * nights : curr.price);
  }, 0);
  const grossTotal = roomSubtotal + addOnsSubtotal;

  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = Math.round((grossTotal * appliedPromo.percent) / 100);
  }

  const taxableAmount = grossTotal - discountAmount;
  const taxesAndFees = Math.round(taxableAmount * 0.12);
  const totalPrice = taxableAmount + taxesAndFees;

  // Toggle add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Promo Code application
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'CHHAYARITH') {
      setAppliedPromo({ code, percent: 15 });
      setPromoMessage('Code CHHAYARITH applied! 15% discount subtracted.');
    } else if (code === 'LUXURY100') {
      setAppliedPromo({ code, percent: 10 });
      setPromoMessage('Code LUXURY100 applied! 10% discount subtracted.');
    } else {
      setPromoMessage('Invalid promo code. Try CHHAYARITH for 15% off.');
    }
  };

  // Process Final Payment
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const newBookingId = `UCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const payment: PaymentDetails = {
        method: paymentMethod,
        cardHolderName: paymentMethod === 'card' ? cardHolderName : fullName,
        cardNumberMasked: paymentMethod === 'card' ? `•••• •••• •••• ${cardNumber.slice(-4) || '8842'}` : 'N/A',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-UCH`,
        amountPaid: totalPrice,
        currency: currentCurrency,
        paidAt: new Date().toISOString(),
      };

      const booking: Booking = {
        id: newBookingId,
        roomId: room.id,
        roomName: room.name,
        roomCategory: room.category,
        roomImage: room.images[0],
        checkInDate,
        checkOutDate,
        nights,
        guests: {
          adults,
          children: childrenCount,
        },
        guestInfo: {
          fullName,
          email,
          phone,
          specialRequests,
          estimatedArrival,
        },
        selectedAddOns,
        pricing: {
          roomSubtotal,
          addOnsSubtotal,
          taxesAndFees,
          discountAmount,
          totalPrice,
          promoCodeUsed: appliedPromo?.code,
        },
        payment,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        qrCodeSeed: `${newBookingId}-PASS`,
      };

      setCompletedBooking(booking);
      onBookingCompleted(booking);
      setIsProcessingPayment(false);
      setStep(4);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff'],
        });
      } catch {
        // fallback ignore
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-4xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">
              Ung Chhayarith Hotel Reservation Gateway
            </span>
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span>{room.name}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Navigation */}
        <div className="bg-slate-950/60 border-b border-white/10 px-6 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span className="hidden sm:inline">Enhancements</span>
            </div>
            <div className={`h-0.5 w-10 sm:w-16 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span className="hidden sm:inline">Guest Info</span>
            </div>
            <div className={`h-0.5 w-10 sm:w-16 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span className="hidden sm:inline">Secure Payment</span>
            </div>
            <div className={`h-0.5 w-10 sm:w-16 ${step >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${step === 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>4</span>
              <span className="hidden sm:inline">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">

          {/* STEP 1: DATES & LUXURY ADD-ONS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Check-In</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Check-Out ({nights} Nights)</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Add-ons Selection */}
              <div className="space-y-3">
                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Enhance Your Stay (Optional Add-ons)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_ADD_ONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold text-white">{addon.name}</h5>
                            <p className="text-[11px] text-slate-400 mt-1">{addon.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="mt-3 text-right">
                          <span className="text-sm font-bold text-emerald-400">
                            +{formatPrice(addon.price, currentCurrency)}
                          </span>
                          <span className="text-[10px] text-slate-400"> {addon.perNight ? '/ night' : 'flat fee'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  Your reservation confirmation email will be automatically sent to the email address provided below.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Primary Guest Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-emerald-400"
                    placeholder="e.g. Ung Chhayarith"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Email Address (For Confirmation) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-emerald-400"
                    placeholder="e.g. guest@domain.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-emerald-400"
                    placeholder="+855 12 345 678"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Estimated Arrival Time</label>
                  <select
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-emerald-400"
                  >
                    <option value="14:00">14:00 (Early Check-In Request)</option>
                    <option value="15:00">15:00 (Standard Check-In)</option>
                    <option value="17:00">17:00 (Late Afternoon)</option>
                    <option value="20:00">20:00 (Evening Arrival)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Special Requests / Preferences</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-400"
                  placeholder="e.g., Honeymoon setup, high floor, quiet room, extra pillows..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: SECURE PAYMENT GATEWAY */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Payment Options Form */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Select Payment Method
                </h4>

                {/* Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'paypal' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="font-serif italic text-base font-black">P</span>
                    <span>PayPal</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'applepay' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-sm"> Pay</span>
                    <span>Apple Pay</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pay_at_hotel')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'pay_at_hotel' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Pay at Hotel</span>
                  </button>
                </div>

                {/* Card Input Form */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-slate-300">Card Details</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        placeholder="4532 •••• •••• ••••"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">CVV Security Code</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-center text-xs text-slate-300 space-y-2">
                    <p>Express 1-Click Verification enabled for <strong>{paymentMethod.toUpperCase()}</strong>.</p>
                    <p className="text-[11px] text-slate-400">Your reservation will be authorized immediately upon confirmation.</p>
                  </div>
                )}

                {/* Promo Code Box */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="bg-transparent text-xs text-white uppercase font-bold focus:outline-none flex-1"
                    placeholder="PROMO CODE"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[11px] text-emerald-400 font-medium pl-1">{promoMessage}</p>
                )}
              </div>

              {/* Right Column: Itemized Pricing Receipt */}
              <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-sm font-serif font-bold text-emerald-400 border-b border-white/10 pb-2">
                  Invoice Summary
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{room.name} ({nights} nights)</span>
                    <span className="font-semibold">{formatPrice(roomSubtotal, currentCurrency)}</span>
                  </div>

                  {addOnsSubtotal > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Luxury Add-ons</span>
                      <span className="font-semibold">{formatPrice(addOnsSubtotal, currentCurrency)}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span>-{formatPrice(discountAmount, currentCurrency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & Resort Fees (12%)</span>
                    <span>{formatPrice(taxesAndFees, currentCurrency)}</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Total Chargeable</span>
                    <span className="text-2xl font-serif font-bold text-emerald-400">
                      {formatPrice(totalPrice, currentCurrency)}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  ⚡ Automatic Instant Confirmation Email will be sent to <strong>{email}</strong> immediately.
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: SUCCESS & EMAIL SENT */}
          {step === 4 && completedBooking && (
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block">
                  Ung Chhayarith Hotel & Resort
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Booking Reference ID: <strong className="text-emerald-400 font-mono text-sm">{completedBooking.id}</strong>
                </p>
              </div>

              {/* Digital Check-In Pass */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
                  <span>VIP Guest: <strong>{completedBooking.guestInfo.fullName}</strong></span>
                  <span>{completedBooking.nights} Nights ({completedBooking.checkInDate} to {completedBooking.checkOutDate})</span>
                </div>
                
                <div className="py-2 flex items-center justify-center gap-3 bg-white/5 rounded-xl border border-white/10 font-mono text-sm text-emerald-400 font-bold tracking-wider">
                  <QrCode className="w-6 h-6 text-emerald-400" />
                  <span>[ QR PASS: {completedBooking.id} ]</span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Present this QR digital code at the Ung Chhayarith Concierge Desk for instant keycard handover.
                </p>
              </div>

              {/* Automated Email Notification Trigger Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-left flex items-start gap-3">
                <Mail className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">Automated Confirmation Email Dispatched!</h5>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    We sent full HTML receipt tickets to <strong>{completedBooking.guestInfo.email}</strong>. You can inspect it anytime in your in-app Email Inbox drawer.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="view-email-inbox-btn"
                  onClick={() => {
                    onClose();
                    onOpenEmailInbox();
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-white/10"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open Email Inbox</span>
                </button>
                <button
                  id="go-to-guest-dashboard-btn"
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard();
                  }}
                  className="px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View in Guest Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Wizard Control Footer (Steps 1, 2, 3) */}
        {step < 4 && (
          <div className="p-4 sm:p-6 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  onClick={() => setStep((step + 1) as any)}
                  className="px-7 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-emerald-400 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="execute-payment-btn"
                  disabled={isProcessingPayment}
                  onClick={handleExecutePayment}
                  className="px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-xl hover:bg-emerald-400 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Pay {formatPrice(totalPrice, currentCurrency)}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
