const API_BASE_URL = "http://localhost:5000";

export const flightService = {
  // Module 1: Search Flights by Route
  searchFlights: async (source, destination) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/flights/search?source=${source}&destination=${destination}`
      );
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "Failed to fetch");
      return result.data; 
    } catch (error) {
      console.error("Flight Service Error:", error);
      throw error;
    }
  }
};