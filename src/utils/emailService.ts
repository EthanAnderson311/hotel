import { Booking, CancellationRequest, TransactionEmail } from '../types';
import { formatPrice } from './currency';

export function createBookingConfirmationEmail(booking: Booking): TransactionEmail {
  const sentAt = new Date().toISOString();
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <!-- Header -->
      <div style="background-color: #0f172a; padding: 32px 24px; text-align: center; color: #ffffff;">
        <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 11px; color: #d97706; margin: 0 0 8px 0; font-weight: 700;">Ung Chhayarith Hotel & Resort</p>
        <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 0.5px;">Reservation Confirmed</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">Booking Ref ID: <strong style="color: #fbbf24;">${booking.id}</strong></p>
      </div>

      <!-- Hero Banner -->
      <div style="padding: 24px;">
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${booking.guestInfo.fullName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for choosing <strong>Ung Chhayarith Hotel & Resort</strong>. We are delighted to confirm your upcoming luxury stay. Below are your complete reservation details.
        </p>

        <!-- Room Details Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 40%;">Accommodation:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${booking.roomName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Check-In Date:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${booking.checkInDate} (From 15:00)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Check-Out Date:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${booking.checkOutDate} (Until 12:00)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Total Stay Duration:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${booking.nights} Night(s)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Guests Count:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${booking.guests.adults} Adult(s), ${booking.guests.children} Child(ren)</td>
            </tr>
          </table>
        </div>

        <!-- Payment Breakdown -->
        <h3 style="font-size: 16px; margin: 24px 0 12px 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Payment & Invoice Summary</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #475569;">Room Charges (${booking.nights} nights):</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatPrice(booking.pricing.roomSubtotal, booking.payment.currency as any)}</td>
          </tr>
          ${booking.pricing.addOnsSubtotal > 0 ? `
          <tr>
            <td style="padding: 6px 0; color: #475569;">Selected Luxury Add-ons:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatPrice(booking.pricing.addOnsSubtotal, booking.payment.currency as any)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #475569;">Taxes & Resort Fees (12%):</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatPrice(booking.pricing.taxesAndFees, booking.payment.currency as any)}</td>
          </tr>
          ${booking.pricing.discountAmount > 0 ? `
          <tr>
            <td style="padding: 6px 0; color: #16a34a;">Promotional Discount:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #16a34a;">-${formatPrice(booking.pricing.discountAmount, booking.payment.currency as any)}</td>
          </tr>` : ''}
          <tr style="border-top: 2px solid #e2e8f0;">
            <td style="padding: 12px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Total Amount Charged:</td>
            <td style="padding: 12px 0; text-align: right; font-size: 16px; font-weight: 700; color: #d97706;">${formatPrice(booking.pricing.totalPrice, booking.payment.currency as any)}</td>
          </tr>
        </table>

        <!-- Payment Method -->
        <div style="margin: 16px 0; padding: 12px; background: #fffbe6; border: 1px solid #fef08a; border-radius: 6px; font-size: 12px; color: #78350f;">
          <strong>Payment Gateway Verification:</strong> Paid via ${booking.payment.method.toUpperCase()} (Txn ID: ${booking.payment.transactionId}). Transaction secured with 256-bit SSL encryption.
        </div>

        <!-- Cancellation Policy Notice -->
        <div style="margin: 20px 0; font-size: 12px; color: #64748b; line-height: 1.5; background-color: #f8fafc; padding: 12px; border-radius: 6px;">
          <strong>Cancellation Policy:</strong> Free cancellation up to 48 hours prior to check-in. Cancellation requests can be processed seamlessly through your Guest Dashboard.
        </div>

        <!-- QR Code Pass Placeholder -->
        <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <p style="font-size: 12px; color: #475569; margin: 0 0 10px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Express Express Check-in Pass</p>
          <div style="display: inline-block; padding: 12px; background: #ffffff; border: 2px solid #0f172a; border-radius: 8px; font-family: monospace; font-size: 16px; font-weight: bold; letter-spacing: 2px;">
            [ QR PASS: ${booking.id} ]
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0;">Present this digital code upon arrival at the VIP Reception Desk.</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #0f172a; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0; color: #94a3b8;">Ung Chhayarith Hotel & Resort • Coastal Boulevard, Sanctuary Bay</p>
        <p style="margin: 4px 0 0 0;">Concierge Line: +855 23 888 999 | Email: reservations@ungchhayarith.com</p>
      </div>
    </div>
  `;

  return {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId: booking.id,
    recipientEmail: booking.guestInfo.email,
    recipientName: booking.guestInfo.fullName,
    subject: `Booking Confirmed #${booking.id} - Ung Chhayarith Hotel & Resort`,
    emailType: 'booking_confirmation',
    sentAt,
    isUnread: true,
    htmlBody,
  };
}

export function createCancellationRequestEmail(booking: Booking, cancelReq: CancellationRequest): TransactionEmail {
  const sentAt = new Date().toISOString();
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background-color: #991b1b; padding: 28px 24px; text-align: center; color: #ffffff;">
        <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 11px; color: #fecaca; margin: 0 0 8px 0; font-weight: 700;">Ung Chhayarith Hotel & Resort</p>
        <h1 style="margin: 0; font-size: 22px; font-weight: 400;">Cancellation Request Received</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #fee2e2;">Booking Ref ID: <strong>${booking.id}</strong></p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${cancelReq.guestName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We have formally received your cancellation request for stay at <strong>${booking.roomName}</strong> from ${booking.checkInDate} to ${booking.checkOutDate}.
        </p>

        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #9f1239; font-size: 14px;">Cancellation Assessment</h4>
          <p style="margin: 4px 0; font-size: 13px; color: #881337;">Reason: <strong>${cancelReq.reason}</strong></p>
          <p style="margin: 4px 0; font-size: 13px; color: #881337;">Policy Refund Eligibility: <strong>${cancelReq.refundEligiblePercent}%</strong></p>
          <p style="margin: 4px 0; font-size: 14px; font-weight: bold; color: #9f1239;">Estimated Refund: ${formatPrice(cancelReq.estimatedRefundAmount, cancelReq.currency as any)}</p>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          Your request is currently under automated processing. Once verified by our accounts department, funds will be refunded to your original payment method (${booking.payment.method.toUpperCase()}) within 3-5 business days.
        </p>

        <p style="font-size: 13px; color: #475569; margin-top: 20px;">
          If you wish to rebook or have questions regarding this request, please contact our Guest Experience Team anytime at support@ungchhayarith.com.
        </p>
      </div>

      <div style="background-color: #0f172a; padding: 18px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">Ung Chhayarith Hotel & Resort • Guest Reservations</p>
      </div>
    </div>
  `;

  return {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId: booking.id,
    recipientEmail: booking.guestInfo.email,
    recipientName: booking.guestInfo.fullName,
    subject: `Cancellation Request Acknowledgment #${booking.id} - Ung Chhayarith Hotel`,
    emailType: 'cancellation_request',
    sentAt,
    isUnread: true,
    htmlBody,
  };
}
