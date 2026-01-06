// Booking Service - Handles all booking-related API calls
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface Booking {
  pnr: string;
  passenger_name: string;
  flight_id: string;
  source: string;
  destination: string;
  departure_time?: string;
  arrival_time?: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending' | 'Checked In';
  seat?: string;
  airline?: string;
  booking_date?: string;
}

export interface RefundStatus {
  pnr: string;
  status: 'Processing' | 'Approved' | 'Completed' | 'Rejected' | 'Pending';
  amount?: number;
  estimated_date?: string;
  reason?: string;
}

export const bookingService = {
  // Get booking details by PNR
  async getBookingByPNR(pnr: string): Promise<Booking | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${pnr}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch booking');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  },

  // Get all bookings for a user (if supported)
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user bookings');
      }
      const data = await response.json();
      return data?.bookings || data || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  // Get refund status by PNR
  async getRefundStatus(pnr: string): Promise<RefundStatus | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/refunds/${pnr}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch refund status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching refund status:', error);
      return null;
    }
  },

  // Download ticket PDF for a PNR
  async downloadTicket(pnr: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${pnr}/ticket`);
      if (!response.ok) {
        throw new Error('Failed to download ticket');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${pnr}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      throw error;
    }
  },
};
