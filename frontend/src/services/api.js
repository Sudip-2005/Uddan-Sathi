const BASE_URL = "http://localhost:5000";

// Generic fetch function with error handling
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);

    // If response is not OK, log text for easier debugging
    if (!res.ok) {
      const text = await res.text();
      console.error(`API fetch failed for ${path}:`, text);
      throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
    }

    // Try parsing JSON, fallback to text if invalid JSON
    try {
      return await res.json();
    } catch (err) {
      const text = await res.text();
      console.warn(`Response is not JSON for ${path}:`, text);
      return text;
    }
  } catch (err) {
    console.error(`Network or fetch error for ${path}:`, err);
    throw err;
  }
}

// ================= Admin API functions =================

// Get all flights
export async function getFlights() {
  return apiFetch("/flights"); // returns { ok: true, data: [...] }
}

// Add a flight
export async function addFlight(flight) {
  return apiFetch("/add-flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flight),
  });
}

// Cancel a flight
export async function cancelFlight(flightId, body) {
  return apiFetch("/cancel-flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, flight_id: flightId }),
  });
}
