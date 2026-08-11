import React, { useState, useEffect } from 'react';
import { 
  Room, 
  Booking, 
  CancellationRequest, 
  TransactionEmail, 
  CurrencyCode, 
  RoomCategory 
} from './types';
import { MOCK_ROOMS } from './data/mockRooms';
import { 
  getStoredBookings, 
  saveBooking, 
  getStoredCancellations, 
  saveCancellationRequest, 
  getStoredEmails, 
  markEmailsAsRead, 
  getStoredCurrency, 
  saveCurrency, 
  DEFAULT_GUEST_PROFILE,
  saveEmail
} from './utils/storage';
import { createCancellationRequestEmail } from './utils/emailService';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingWizardModal } from './components/BookingWizardModal';
import { GuestDashboard } from './components/GuestDashboard';
import { CancellationModal } from './components/CancellationModal';
import { EmailInboxModal } from './components/EmailInboxModal';
import { AmenitiesSection } from './components/AmenitiesSection';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, Filter, Search, RotateCcw } from 'lucide-react';

export default function App() {
  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<'explore' | 'dashboard' | 'amenities'>('explore');

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency());

  // Data Store States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellations, setCancellations] = useState<CancellationRequest[]>([]);
  const [emails, setEmails] = useState<TransactionEmail[]>([]);

  // Search & Filter State
  const [checkInDate, setCheckInDate] = useState('2026-09-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-18');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('All');
  const [priceSort, setPriceSort] = useState<'recommended' | 'low-high' | 'high-low'>('recommended');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals
  const [quickViewRoom, setQuickViewRoom] = useState<Room | null>(null);
  const [bookingWizardRoom, setBookingWizardRoom] = useState<Room | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);

  // Load Initial Persisted Data
  useEffect(() => {
    setBookings(getStoredBookings());
    setCancellations(getStoredCancellations());
    setEmails(getStoredEmails());
  }, []);

  // Change currency
  const handleSelectCurrency = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    saveCurrency(newCurrency);
  };

  // Filtered & Sorted Rooms List
  const filteredRooms = MOCK_ROOMS.filter((room) => {
    if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;
    if (searchKeyword.trim() !== '') {
      const q = searchKeyword.toLowerCase();
      const matchName = room.name.toLowerCase().includes(q);
      const matchDesc = room.description.toLowerCase().includes(q);
      const matchFeat = room.popularFeatures.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchFeat) return false;
    }
    return true;
  }).sort((a, b) => {
    if (priceSort === 'low-high') return a.pricePerNight - b.pricePerNight;
    if (priceSort === 'high-low') return b.pricePerNight - a.pricePerNight;
    return b.rating - a.rating;
  });

  // Handle Completed Booking
  const handleBookingCompleted = (newBooking: Booking) => {
    const updatedBookings = saveBooking(newBooking);
    setBookings(updatedBookings);
    setEmails(getStoredEmails());
  };

  // Handle Cancellation Submission
  const handleConfirmCancellation = (request: CancellationRequest) => {
    const updatedCancellations = saveCancellationRequest(request);
    setCancellations(updatedCancellations);
    setBookings(getStoredBookings());

    // Generate cancellation email notification
    const booking = bookings.find((b) => b.id === request.bookingId);
    if (booking) {
      const email = createCancellationRequestEmail(booking, request);
      const updatedEmails = saveEmail(email);
      setEmails(updatedEmails);
    }
  };

  // Mark all emails as read
  const handleMarkAllEmailsAsRead = () => {
    const updated = markEmailsAsRead();
    setEmails(updated);
  };

  const unreadEmailCount = emails.filter((e) => e.isUnread).length;

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -right-[10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <div className="relative z-10">
        <Header
          currentCurrency={currency}
          onSelectCurrency={handleSelectCurrency}
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
          unreadEmailCount={unreadEmailCount}
          onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
          guestProfile={DEFAULT_GUEST_PROFILE}
          bookingCount={bookings.filter((b) => b.status === 'Confirmed').length}
        />
      </div>

      {/* MAIN VIEW SYSTEM */}
      <main className="flex-1 relative z-10">
        {activeTab === 'explore' && (
          <div>
            {/* Hero Section */}
            <Hero
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              adultsCount={adultsCount}
              setAdultsCount={setAdultsCount}
              childrenCount={childrenCount}
              setChildrenCount={setChildrenCount}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearch={() => {
                const el = document.getElementById('rooms-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Room Category Tabs & Filter Toolbar */}
            <div id="rooms-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block">
                    Exclusive Accommodation
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                    Rooms & Luxury Suites
                  </h2>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['All', 'Suite', 'Villa', 'Penthouse', 'Deluxe'] as RoomCategory[]).map((cat) => (
                    <button
                      key={cat}
                      id={`category-btn-${cat}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                          : 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10 backdrop-blur-md'
                      }`}
                    >
                      {cat === 'All' ? 'All Suites & Villas' : `${cat}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                {/* Search Keyword */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search by suite name or feature..."
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Sorting options */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort By:</span>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value as any)}
                    className="bg-slate-950/60 border border-white/10 text-emerald-400 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="recommended">Highest Guest Rating</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Room Cards Grid */}
              {filteredRooms.length === 0 ? (
                <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 space-y-3">
                  <SlidersHorizontal className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Suites Found</h3>
                  <p className="text-xs text-slate-400">Try adjusting your category filter or search terms.</p>
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchKeyword(''); }}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 inline-flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      currentCurrency={currency}
                      onQuickView={(r) => setQuickViewRoom(r)}
                      onBookNow={(r) => setBookingWizardRoom(r)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Resort Amenities Highlights */}
            <AmenitiesSection />
          </div>
        )}

        {/* GUEST DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <GuestDashboard
            bookings={bookings}
            cancellations={cancellations}
            guestProfile={DEFAULT_GUEST_PROFILE}
            currentCurrency={currency}
            onRequestCancellation={(b) => setCancellingBooking(b)}
            onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
            onExploreRooms={() => setActiveTab('explore')}
          />
        )}

        {/* RESORT AMENITIES TAB */}
        {activeTab === 'amenities' && (
          <div className="py-8">
            <AmenitiesSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}

      {/* 1. Room Detail Quick View Modal */}
      {quickViewRoom && (
        <RoomDetailModal
          room={quickViewRoom}
          onClose={() => setQuickViewRoom(null)}
          currentCurrency={currency}
          onProceedToBooking={(r) => setBookingWizardRoom(r)}
        />
      )}

      {/* 2. Step-by-Step Reservation & Secure Payment Gateway Modal */}
      {bookingWizardRoom && (
        <BookingWizardModal
          room={bookingWizardRoom}
          onClose={() => setBookingWizardRoom(null)}
          currentCurrency={currency}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialAdults={adultsCount}
          initialChildren={childrenCount}
          onBookingCompleted={handleBookingCompleted}
          onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
          onNavigateToDashboard={() => setActiveTab('dashboard')}
        />
      )}

      {/* 3. Cancellation Request Modal */}
      {cancellingBooking && (
        <CancellationModal
          booking={cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          currentCurrency={currency}
          onConfirmCancellation={handleConfirmCancellation}
        />
      )}

      {/* 4. Automated Transactional Email Confirmation Inbox */}
      {isEmailInboxOpen && (
        <EmailInboxModal
          emails={emails}
          onClose={() => setIsEmailInboxOpen(false)}
          onMarkAllAsRead={handleMarkAllEmailsAsRead}
        />
      )}
    </div>
  );
}
