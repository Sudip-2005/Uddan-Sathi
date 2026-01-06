// src/services/api.js

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE = import.meta.env.VITE_BACKEND_URL;

/**
 * Generic fetch function with error handling
 * Integrated to handle the specific "airport" query parameters
 */
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);

    // If response is not OK, log text for easier debugging
    if (!res.ok) {
      const text = await res.text();
      console.error(`API fetch failed for ${path}:`, text);
      throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
    }

    // Try parsing JSON
    try {
      const json = await res.json();
      
      /** * Standardizing the response format.
       * If backend returns just an array, we wrap it. 
       * If it already has an { ok, data } structure, we return as is.
       */
      return json.data ? json : { ok: true, data: json };
      
    } catch (err) {
      const text = await res.text();
      console.warn(`Response is not JSON for ${path}:`, text);
      return { ok: true, data: text };
    }
  } catch (err) {
    console.error(`Network or fetch error for ${path}:`, err);
    throw err;
  }
}

// ================= Admin API functions =================

/**
 * UPDATED: Fetches flights based on a specific airport.
 * @param {string} airportCode - The IATA code (e.g., "DEL", "BOM") 
 * This ensures the admin only sees data for the selected terminal.
 */
export async function getFlights(airportCode = "") {
  // Construct query string: e.g., /flights?airport=DEL
  const path = airportCode ? `/flights?airport=${airportCode}` : "/flights";
  return apiFetch(path);
}

/**
 * Add a flight to the live network
 */
export async function addFlight(flight) {
  return apiFetch("/add-flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flight),
  });
}

// --- ADD THESE TO api.js ---

export const getRefundRequests = async () => {
    const response = await fetch(`${BASE_URL}/api/refunds`);
    return await response.json();
};

export const completeRefund = async (flightId, paxId) => {
    const response = await fetch(`${BASE_URL}/api/refunds/${flightId}/${paxId}`, {
        method: 'DELETE',
    });
    return await response.json();
};

/**
 * Terminate/Cancel a flight mission
 * Merges reason and admin details into the body
 */
export async function cancelFlight(flightId, body) {
  return apiFetch("/cancel-flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, flight_id: flightId }),
  });
}

/**
 * Updates flight status (e.g., to 'Delayed' or 'Diverted')
 * @param {string} flightId - The ID of the flight (e.g., '6E456')
 * @param {object} updateData - Object containing { status, delay }
 * @param {string} source - The airport code (e.g., 'DEL') used for the DB path
 */
export const updateFlightStatus = async (flightId, updateData, source = "DEL") => {
  try {
    // We use PATCH so we don't overwrite the entire flight object
    const res = await fetch(`${BASE_URL}/flights/${source}/${flightId}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update flight status");
    }

    return { ok: true, data };
  } catch (err) {
    console.error("API Update Error:", err);
    return { ok: false, error: err.message };
  }
};

/**
 * sendRefundRequest(data)
 * data: { airport_code, flight_id, passenger_id, name, pnr, upi_id, amount, reason }
 */
export async function sendRefundRequest(data) {
  const res = await fetch(`${API_BASE}/api/refunds/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit refund");
  return res.json();
}

export async function getFlightsByAirport(airportCode) {
  const res = await fetch(`${API_BASE}/api/refunds/${encodeURIComponent(airportCode)}`);
  if (!res.ok) throw new Error("Failed to fetch flights");
  return res.json();
}

export async function getRefundsByFlight(airportCode, flightId) {
  const res = await fetch(
    `${API_BASE}/api/refunds/${encodeURIComponent(airportCode)}/${encodeURIComponent(flightId)}`
  );
  if (!res.ok) throw new Error("Failed to fetch refunds");
  return res.json();
}

export async function finalizeRefund(airportCode, flightId, paxId) {
  const res = await fetch(
    `${API_BASE}/api/refunds/${encodeURIComponent(airportCode)}/${encodeURIComponent(flightId)}/${encodeURIComponent(paxId)}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to finalize refund");
  return res.json();
}