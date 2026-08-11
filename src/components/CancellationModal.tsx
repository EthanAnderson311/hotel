import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, DollarSign, ArrowRight, CheckSquare } from 'lucide-react';
import { Booking, CancellationRequest, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CancellationModalProps {
  booking: Booking | null;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  onConfirmCancellation: (request: CancellationRequest) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  booking,
  onClose,
  currentCurrency,
  onConfirmCancellation,
}) => {
  if (!booking) return null;

  const [reason, setReason] = useState('Schedule Change');
  const [customNotes, setCustomNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Policy Refund percentage based on days until check-in
  const calculateRefundEligibility = () => {
    try {
      const today = new Date();
      const checkIn = new Date(booking.checkInDate);
      const diffHours = (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60);

      if (diffHours >= 48) {
        return { percent: 100, label: 'Full Refund (Over 48h prior to check-in)' };
      } else if (diffHours >= 24) {
        return { percent: 50, label: '50% Refund (24h-48h prior to check-in)' };
      } else {
        return { percent: 25, label: '25% Resort Credit (<24h prior to check-in)' };
      }
    } catch {
      return { percent: 100, label: 'Standard Policy Assessment' };
    }
  };

  const policy = calculateRefundEligibility();
  const totalPaid = booking.pricing.totalPrice;
  const estimatedRefund = Math.round((totalPaid * policy.percent) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const cancellationReq: CancellationRequest = {
        id: `CAN-${Date.now().toString().slice(-6)}`,
        bookingId: booking.id,
        roomName: booking.roomName,
        guestName: booking.guestInfo.fullName,
        guestEmail: booking.guestInfo.email,
        requestedAt: new Date().toISOString(),
        reason,
        customNotes,
        refundEligiblePercent: policy.percent,
        estimatedRefundAmount: estimatedRefund,
        currency: booking.payment.currency || currentCurrency,
        status: 'Approved & Refunded',
        adminNotes: 'Automated policy engine approved 100% refund for flexible luxury window.',
      };

      onConfirmCancellation(cancellationReq);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-lg bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-lg font-serif font-bold text-white">Cancellation Request</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Booking Ref ID:</span>
            <strong className="text-emerald-400 font-mono">{booking.id}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Room:</span>
            <span className="font-semibold text-white">{booking.roomName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Check-in Date:</span>
            <span className="font-semibold text-white">{booking.checkInDate}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Total Paid Amount:</span>
            <span className="font-semibold text-emerald-400">{formatPrice(totalPaid, currentCurrency)}</span>
          </div>
        </div>

        {/* Policy Assessment */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ung Chhayarith Cancellation Policy Guarantee</span>
          </div>
          <p className="text-emerald-200/90 text-[11px] leading-relaxed">
            Policy Rule: <strong>{policy.label}</strong>
          </p>
          <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-center text-sm">
            <span className="font-bold text-white">Calculated Refund:</span>
            <span className="font-serif font-bold text-emerald-400 text-lg">
              {formatPrice(estimatedRefund, currentCurrency)} ({policy.percent}%)
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Reason for Cancellation *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Schedule Change">Schedule / Date Change</option>
              <option value="Travel Conflict">Unexpected Flight or Travel Conflict</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Found Alternative">Found Alternative Hotel</option>
              <option value="Personal Reasons">Personal / Family Reasons</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Additional Comments (Optional)</label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs text-white"
              placeholder="Provide any additional context for our reservation desk..."
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 leading-tight">
              I acknowledge that submitting this request will cancel my stay at Ung Chhayarith Resort and release room availability. Refund will process within 3-5 business days.
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold"
            >
              Keep My Reservation
            </button>
            <button
              id="confirm-cancellation-submit-btn"
              type="submit"
              disabled={!acceptedTerms || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Processing Cancellation...' : 'Submit Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
