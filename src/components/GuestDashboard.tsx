import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  QrCode, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Award, 
  CreditCard,
  MapPin,
  FileText,
  Mail,
  RefreshCw,
  Search
} from 'lucide-react';
import { Booking, CancellationRequest, GuestProfile, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface GuestDashboardProps {
  bookings: Booking[];
  cancellations: CancellationRequest[];
  guestProfile: GuestProfile;
  currentCurrency: CurrencyCode;
  onRequestCancellation: (booking: Booking) => void;
  onOpenEmailInbox: () => void;
  onExploreRooms: () => void;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({
  bookings,
  cancellations,
  guestProfile,
  currentCurrency,
  onRequestCancellation,
  onOpenEmailInbox,
  onExploreRooms,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'cancellations' | 'history' | 'profile'>('upcoming');
  const [selectedQrBooking, setSelectedQrBooking] = useState<Booking | null>(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Cancellation Requested');
  const historicBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Top Banner: Welcome Guest Profile */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-serif font-bold text-2xl shadow-xl border border-white/20">
              UC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Welcome, {guestProfile.name}
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  {guestProfile.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Member ID: <strong>UCH-VIP-9942</strong></span>
                <span>•</span>
                <span>Loyalty Balance: <strong className="text-emerald-400">{guestProfile.loyaltyPoints.toLocaleString()} PTS</strong></span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-email-inbox-btn"
              onClick={onOpenEmailInbox}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold hover:border-emerald-500/50 flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Automated Email Logs</span>
            </button>
            <button
              onClick={onExploreRooms}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg hover:bg-emerald-400 transition-all"
            >
              + Book New Suite
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 sm:gap-6 overflow-x-auto pb-1 text-xs font-bold">
        <button
          id="tab-btn-upcoming"
          onClick={() => setActiveTab('upcoming')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'upcoming'
              ? 'border-emerald-400 text-emerald-400 bg-white/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Active Bookings ({activeBookings.length})</span>
        </button>

        <button
          id="tab-btn-cancellations"
          onClick={() => setActiveTab('cancellations')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'cancellations'
              ? 'border-emerald-400 text-emerald-400 bg-white/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Cancellation Requests ({cancellations.length})</span>
        </button>

        <button
          id="tab-btn-history"
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'history'
              ? 'border-emerald-400 text-emerald-400 bg-white/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Stay History & Receipts ({historicBookings.length})</span>
        </button>

        <button
          id="tab-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'border-emerald-400 text-emerald-400 bg-white/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Loyalty Rewards & Profile</span>
        </button>
      </div>

      {/* TAB 1: UPCOMING RESERVATIONS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {activeBookings.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl space-y-4">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Active Upcoming Reservations</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to plan your luxury getaway at Ung Chhayarith Hotel & Resort? Explore our luxury suites and villas now.
              </p>
              <button
                onClick={onExploreRooms}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg"
              >
                Browse Suites & Reserve
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/50 rounded-3xl p-6 shadow-xl space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          {b.id}
                        </span>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white mt-2">
                        {b.roomName}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Amount Charged</span>
                      <span className="text-2xl font-serif font-bold text-emerald-400">
                        {formatPrice(b.pricing.totalPrice, currentCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Room Photo & Specs */}
                    <div className="flex items-center gap-4">
                      <img
                        src={b.roomImage}
                        alt={b.roomName}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover border border-white/10"
                      />
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-white">Guest: {b.guestInfo.fullName}</p>
                        <p className="text-slate-400">Occupancy: {b.guests.adults} Adults, {b.guests.children} Children</p>
                        <p className="text-slate-400">Arrival Est: {b.guestInfo.estimatedArrival || '15:00'}</p>
                      </div>
                    </div>

                    {/* Dates Card */}
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400">Check-In:</span>
                        <strong className="text-white">{b.checkInDate} (15:00)</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400">Check-Out:</span>
                        <strong className="text-white">{b.checkOutDate} (12:00)</strong>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-emerald-400">
                        <span>Duration:</span>
                        <span>{b.nights} Night(s) Stay</span>
                      </div>
                    </div>

                    {/* Quick Pass & Management Actions */}
                    <div className="flex flex-col justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
                      <button
                        onClick={() => setSelectedQrBooking(b)}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-bold border border-white/10 flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Express Digital QR Pass</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInvoiceBooking(b)}
                          className="flex-1 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:text-white border border-white/10"
                        >
                          Invoice Receipt
                        </button>

                        {b.status === 'Confirmed' && (
                          <button
                            id={`request-cancel-${b.id}`}
                            onClick={() => onRequestCancellation(b)}
                            className="flex-1 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 text-xs font-bold border border-red-900/50 transition-colors"
                          >
                            Request Cancellation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANCELLATION REQUESTS MANAGEMENT */}
      {activeTab === 'cancellations' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Cancellation Policy & Automated Processing Log
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ung Chhayarith Hotel & Resort offers a guaranteed 48-hour free cancellation window for luxury reservations. Below is the record of all cancellation requests submitted by your account along with calculated refund amounts.
            </p>

            {cancellations.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No cancellation requests have been submitted.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {cancellations.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-slate-950/60 border border-red-900/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">
                          Request Ref: {c.id} (Booking #{c.bookingId})
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{c.roomName}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        {c.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Submitted At:</span>
                        <strong className="text-white">{new Date(c.requestedAt).toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Reason Stated:</span>
                        <strong className="text-white">{c.reason}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Refund Issued:</span>
                        <strong className="text-emerald-400 font-serif font-bold text-sm">
                          {formatPrice(c.estimatedRefundAmount, currentCurrency)} ({c.refundEligiblePercent}%)
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STAY HISTORY & RECEIPTS */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Historical Stays & Invoices</h3>
            <div className="divide-y divide-white/10">
              {bookings.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.roomName}</h4>
                    <p className="text-slate-400">{b.checkInDate} to {b.checkOutDate} • Ref #{b.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400 text-sm">
                      {formatPrice(b.pricing.totalPrice, currentCurrency)}
                    </span>
                    <button
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOYALTY REWARDS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Ung Chhayarith Loyalty Privilege
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <p className="text-emerald-300 font-bold text-sm">{guestProfile.tier} Status Active</p>
              <p className="text-slate-300">Points Balance: <strong>{guestProfile.loyaltyPoints.toLocaleString()} PTS</strong></p>
            </div>

            <h4 className="text-sm font-bold text-white pt-2">Unlocked Member Benefits:</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Complimentary welcome Moët & Chandon champagne upon arrival</li>
              <li className="flex items-center gap-2">✓ Late check-out privileges until 15:00</li>
              <li className="flex items-center gap-2">✓ Priority room upgrade to Oceanfront category</li>
              <li className="flex items-center gap-2">✓ 20% discount on Herbal Spa treatments</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Guest Account Information</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Full Name</span>
                <strong className="text-white text-sm">{guestProfile.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Registered Email</span>
                <strong className="text-white text-sm">{guestProfile.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <strong className="text-white text-sm">{guestProfile.phone}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR PASS MODAL */}
      {selectedQrBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h4 className="text-lg font-serif font-bold text-white">Digital Check-In Pass</h4>
            <p className="text-xs text-slate-400">Reservation #{selectedQrBooking.id}</p>

            <div className="p-6 bg-white rounded-2xl border-2 border-slate-950 inline-block my-2 shadow-2xl">
              <div className="font-mono text-slate-950 font-bold text-lg tracking-wider">
                [ QR: {selectedQrBooking.id} ]
              </div>
            </div>

            <p className="text-xs text-emerald-400 font-semibold">
              Scan at Ung Chhayarith VIP Reception
            </p>

            <button
              onClick={() => setSelectedQrBooking(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* INVOICE RECEIPT MODAL */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-lg w-full text-slate-100 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="text-lg font-serif font-bold text-white">Official Tax Invoice</h4>
              <button onClick={() => setSelectedInvoiceBooking(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between">
                <span>Invoice No:</span>
                <strong className="font-mono text-emerald-400">INV-{selectedInvoiceBooking.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Issued To:</span>
                <strong>{selectedInvoiceBooking.guestInfo.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Accommodation:</span>
                <strong>{selectedInvoiceBooking.roomName}</strong>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-400">{formatPrice(selectedInvoiceBooking.pricing.totalPrice, currentCurrency)}</span>
              </div>
            </div>

            <button
              onClick={() => alert("Invoice PDF download simulated!")}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
