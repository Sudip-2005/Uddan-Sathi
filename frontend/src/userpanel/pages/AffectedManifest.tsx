import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

type CancelledFlight = {
  flight_id: string;
  count: number;
};

type Passenger = {
  passenger_id: string;
  name?: string;
  pnr?: string;
  seat?: string | null;
  email?: string | null;
  notification_sent?: boolean;
};

export default function AffectedManifest() {
  const [airport, setAirport] = useState<string>("DEL");
  const [flights, setFlights] = useState<CancelledFlight[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);

  useEffect(() => {
    if (airport) fetchCancelledFlights(airport);
  }, []);

  async function fetchCancelledFlights(code: string) {
    setLoadingFlights(true);
    try {
      const res = await fetch(`${API_BASE}/api/refunds/${code}`);
      if (!res.ok) throw new Error("Failed to fetch cancelled flights");
      const data = await res.json();
      setFlights(data || []);
    } catch (e) {
      console.error(e);
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  }

  async function fetchPassengersForFlight(flightId: string) {
    if (!airport) return;
    setLoadingPassengers(true);
    try {
      const res = await fetch(`${API_BASE}/api/refunds/${airport}/${flightId}`);
      if (!res.ok) throw new Error("Failed to fetch passengers");
      const data = await res.json();
      setPassengers(data || []);
      setSelectedFlight(flightId);
    } catch (e) {
      console.error(e);
      setPassengers([]);
      setSelectedFlight(null);
    } finally {
      setLoadingPassengers(false);
    }
  }

  function exportCsv() {
    if (!selectedFlight) return;
    const header = ["PNR", "Name", "Seat", "Email", "Notification Sent"];
    const rows = passengers.map((p) => [p.pnr || "", p.name || "", p.seat || "", p.email || "", p.notification_sent ? "Sent" : "Pending"]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manifest_${selectedFlight}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function resendNotification(pnr?: string) {
    if (!pnr) return;
    try {
      await fetch(`${API_BASE}/admin/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr, message: `Flight ${selectedFlight} cancelled - please check options.` })
      });
      // Refresh passenger list to reflect new notification status
      if (selectedFlight) await fetchPassengersForFlight(selectedFlight);
    } catch (e) {
      console.error("resendNotification error", e);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Affected Manifest (Cancelled Flights)</h2>

      <div className="flex items-center gap-2 mb-4">
        <label className="mr-2">Airport code</label>
        <input value={airport} onChange={(e) => setAirport(e.target.value.toUpperCase())} className="border px-2 py-1" />
        <button onClick={() => fetchCancelledFlights(airport)} className="bg-blue-600 text-white px-3 py-1 rounded">Search</button>
      </div>

      <div className="mb-6">
        <h3 className="font-medium">Cancelled Flights</h3>
        {loadingFlights ? (
          <div>Loading...</div>
        ) : flights.length === 0 ? (
          <div className="text-sm text-gray-500">No cancelled flights found for {airport}.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Flight</th>
                <th className="border px-2 py-1">Affected Pax</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.flight_id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{f.flight_id}</td>
                  <td className="border px-2 py-1 text-center">{f.count}</td>
                  <td className="border px-2 py-1">
                    <button onClick={() => fetchPassengersForFlight(f.flight_id)} className="text-sm text-blue-600">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h3 className="font-medium">Passengers{selectedFlight ? ` — ${selectedFlight}` : ""}</h3>
        {loadingPassengers ? (
          <div>Loading passengers...</div>
        ) : selectedFlight && passengers.length === 0 ? (
          <div className="text-sm text-gray-500">No passengers found for {selectedFlight}.</div>
        ) : selectedFlight ? (
          <>
            <div className="my-2 flex gap-2">
              <button onClick={exportCsv} className="bg-green-600 text-white px-3 py-1 rounded">Export CSV</button>
            </div>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">PNR</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Seat</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Notification</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p.passenger_id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{p.pnr}</td>
                    <td className="border px-2 py-1">{p.name}</td>
                    <td className="border px-2 py-1">{p.seat || "-"}</td>
                    <td className="border px-2 py-1">{p.email || "-"}</td>
                    <td className="border px-2 py-1">{p.notification_sent ? <span className="text-green-700">Sent</span> : <span className="text-yellow-700">Pending</span>}</td>
                    <td className="border px-2 py-1">
                      {!p.notification_sent && (
                        <button onClick={() => resendNotification(p.pnr)} className="text-sm text-blue-600">Resend</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-sm text-gray-500">Select a flight to view affected passengers.</div>
        )}
      </div>
    </div>
  );
}
