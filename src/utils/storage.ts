import { Booking, CancellationRequest, TransactionEmail, GuestProfile, CurrencyCode } from '../types';
import { createBookingConfirmationEmail } from './emailService';

const STORAGE_KEYS = {
  BOOKINGS: 'ung_chhayarith_bookings',
  CANCELLATIONS: 'ung_chhayarith_cancellations',
  EMAILS: 'ung_chhayarith_emails',
  GUEST_PROFILE: 'ung_chhayarith_guest_profile',
  CURRENCY: 'ung_chhayarith_currency',
};

// Initial default guest profile
export const DEFAULT_GUEST_PROFILE: GuestProfile = {
  name: 'Ung Chhayarith',
  email: 'chhayarithung855@gmail.com',
  phone: '+855 12 345 678',
  tier: 'Diamond Elite',
  loyaltyPoints: 12450,
  memberSince: '2024-01-15',
};

// Initial sample booking to populate dashboard
export const DEFAULT_BOOKING: Booking = {
  id: 'UCH-2026-8942',
  roomId: 'room-1',
  roomName: 'Grand Royal Oceanfront Suite',
  roomCategory: 'Suite',
  roomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  checkInDate: '2026-09-15',
  checkOutDate: '2026-09-18',
  nights: 3,
  guests: {
    adults: 2,
    children: 1,
  },
  guestInfo: {
    fullName: 'Ung Chhayarith',
    email: 'chhayarithung855@gmail.com',
    phone: '+855 12 345 678',
    specialRequests: 'High floor preference with ocean sunset view. Celebrating family vacation.',
    estimatedArrival: '15:30',
  },
  selectedAddOns: [
    {
      id: 'addon-1',
      name: 'VIP Airport Luxury Transfer',
      description: 'Chauffeur-driven luxury transfer',
      price: 120,
      perNight: false,
    },
  ],
  pricing: {
    roomSubtotal: 1740,
    addOnsSubtotal: 120,
    taxesAndFees: 223,
    discountAmount: 100,
    totalPrice: 1983,
    promoCodeUsed: 'LUXURY100',
  },
  payment: {
    method: 'card',
    cardHolderName: 'Ung Chhayarith',
    cardNumberMasked: '•••• •••• •••• 8842',
    transactionId: 'TXN-998412-UCH',
    amountPaid: 1983,
    currency: 'USD',
    paidAt: '2026-08-01T10:30:00Z',
  },
  status: 'Confirmed',
  createdAt: '2026-08-01T10:30:00Z',
  qrCodeSeed: 'UCH-2026-8942-PASS',
};

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      const initial = [DEFAULT_BOOKING];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_BOOKING];
  }
}

export function saveBooking(booking: Booking): Booking[] {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  // Auto-generate transaction email
  const email = createBookingConfirmationEmail(booking);
  saveEmail(email);

  return updated;
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): Booking[] {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  return updated;
}

export function getStoredCancellations(): CancellationRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CANCELLATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCancellationRequest(cancellation: CancellationRequest): CancellationRequest[] {
  const current = getStoredCancellations();
  const updated = [cancellation, ...current];
  localStorage.setItem(STORAGE_KEYS.CANCELLATIONS, JSON.stringify(updated));

  // Update booking status
  updateBookingStatus(cancellation.bookingId, 'Cancellation Requested');

  return updated;
}

export function getStoredEmails(): TransactionEmail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!raw) {
      const initialEmail = createBookingConfirmationEmail(DEFAULT_BOOKING);
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify([initialEmail]));
      return [initialEmail];
    }
    return JSON.parse(raw);
  } catch {
    const initialEmail = createBookingConfirmationEmail(DEFAULT_BOOKING);
    return [initialEmail];
  }
}

export function saveEmail(email: TransactionEmail): TransactionEmail[] {
  const current = getStoredEmails();
  const updated = [email, ...current];
  localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(updated));
  return updated;
}

export function markEmailsAsRead(): TransactionEmail[] {
  const current = getStoredEmails();
  const updated = current.map((e) => ({ ...e, isUnread: false }));
  localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(updated));
  return updated;
}

export function getStoredCurrency(): CurrencyCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return (raw as CurrencyCode) || 'USD';
  } catch {
    return 'USD';
  }
}

export function saveCurrency(currency: CurrencyCode) {
  localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
}
