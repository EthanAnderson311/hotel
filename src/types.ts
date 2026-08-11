export type RoomCategory = 'All' | 'Deluxe' | 'Suite' | 'Villa' | 'Penthouse';

export interface RoomAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  category: 'Deluxe' | 'Suite' | 'Villa' | 'Penthouse';
  tagline: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  capacity: {
    adults: number;
    children: number;
  };
  sizeSqm: number;
  bedType: string;
  view: string;
  images: string[];
  description: string;
  amenities: string[];
  popularFeatures: string[];
  cancellationPolicy: 'Free Cancellation (48h)' | 'Non-refundable' | 'Flexible (24h)';
  available: boolean;
  reviews: Review[];
}

export interface BookingAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  perNight: boolean;
}

export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancellation Requested' | 'Cancelled';

export interface PaymentDetails {
  method: 'card' | 'paypal' | 'applepay' | 'pay_at_hotel';
  cardHolderName?: string;
  cardNumberMasked?: string;
  transactionId: string;
  amountPaid: number;
  currency: string;
  paidAt: string;
}

export interface Booking {
  id: string; // e.g. UCH-2026-8942
  roomId: string;
  roomName: string;
  roomCategory: string;
  roomImage: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    estimatedArrival?: string;
  };
  selectedAddOns: BookingAddOn[];
  pricing: {
    roomSubtotal: number;
    addOnsSubtotal: number;
    taxesAndFees: number;
    discountAmount: number;
    totalPrice: number;
    promoCodeUsed?: string;
  };
  payment: PaymentDetails;
  status: BookingStatus;
  createdAt: string;
  qrCodeSeed: string;
}

export interface CancellationRequest {
  id: string;
  bookingId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  requestedAt: string;
  reason: string;
  customNotes?: string;
  refundEligiblePercent: number;
  estimatedRefundAmount: number;
  currency: string;
  status: 'Pending Review' | 'Approved & Refunded' | 'Rejected';
  adminNotes?: string;
}

export interface TransactionEmail {
  id: string;
  bookingId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  emailType: 'booking_confirmation' | 'cancellation_request' | 'cancellation_approved' | 'payment_receipt';
  sentAt: string;
  isUnread: boolean;
  htmlBody: string;
}

export interface GuestProfile {
  name: string;
  email: string;
  phone: string;
  tier: 'Gold Member' | 'Platinum Preferred' | 'Diamond Elite';
  loyaltyPoints: number;
  memberSince: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KHR' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD 1.0
  format: (amount: number) => string;
}
