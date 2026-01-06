// Notification Service - Handles all notification-related API calls
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface Notification {
  id: string;
  pnr: string;
  type: 'info' | 'warning' | 'cancelled' | 'delayed' | 'gate_change' | 'boarding';
  message: string;
  timestamp: string;
  flight_id?: string;
  read?: boolean;
}

export const notificationService = {
  // Get notifications for a specific PNR
  async getNotificationsByPNR(pnr: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${pnr}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      return data?.notifications || data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Get all notifications (if supported by backend)
  async getAllNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch all notifications');
      }
      const data = await response.json();
      return data?.notifications || data || [];
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return [];
    }
  },

  // Check if there are any cancellation notifications
  hasCancellations(notifications: Notification[]): boolean {
    return notifications.some(n => n.type === 'cancelled');
  },

  // Get only cancellation notifications
  getCancellations(notifications: Notification[]): Notification[] {
    return notifications.filter(n => n.type === 'cancelled');
  },
};
