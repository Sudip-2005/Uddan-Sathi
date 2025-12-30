// flightService.ts - Enhanced with robust filtering logic

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface Flight {
  id: string;
  source: string;
  destination: string;
  airline: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Departed' | 'Arrived';
  price?: string;
  departure_time?: string;
  arrival_time?: string;
  gate?: string;
  terminal?: string;
}

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}

export const flightService = {
  /**
   * Fetches the full list of flights from the Flask backend.
   */
  async getFlights(): Promise<Flight[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result: ApiResponse<Flight[]> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('flightService.getFlights failed:', error);
      return [];
    }
  },

  /**
   * Fetches all flights and applies a bidirectional "fuzzy" filter.
   * This solves the "del" vs "delhi" matching issue.
   */
  async getFlightsByAirport(airportName: string): Promise<Flight[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights`);
      if (!response.ok) throw new Error('Failed to fetch flights');
      
      const result: ApiResponse<Flight[]> = await response.json();
      const allFlights: Flight[] = result.data || [];

      // If search input is empty, return all available flights
      if (!airportName || !airportName.trim()) {
        return allFlights;
      }

      const searchTerm = airportName.toLowerCase().trim();

      return allFlights.filter(f => {
        // Handle potential undefined or null source fields safely
        const flightSource = (f.source || "").toLowerCase().trim();
        
        // BIDIRECTIONAL CHECK:
        // 1. Does "delhi" contain "del"? (Search: delhi, DB: del)
        // 2. Does "del" contain "delhi"? (Search: del, DB: delhi)
        return flightSource.includes(searchTerm) || searchTerm.includes(flightSource);
      });
    } catch (error) {
      console.error('Error in flightService.getFlightsByAirport:', error);
      return [];
    }
  },

  /**
   * Specific search by route (Source and Destination)
   */
  async searchFlights(source: string, destination: string): Promise<Flight[]> {
    try {
      const params = new URLSearchParams({ 
        source: source.trim(), 
        destination: destination.trim() 
      });
      const response = await fetch(`${API_BASE_URL}/flights/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search request failed');
      
      const result: ApiResponse<Flight[]> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('flightService.searchFlights failed:', error);
      return [];
    }
  }
};