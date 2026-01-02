import React, { useEffect, useState } from "react";
import { Banknote, ShieldCheck, RefreshCw, Search } from "lucide-react";
import { getFlightsByAirport, getRefundsByFlight, finalizeRefund } from "../services/api";

type Refund = {
  passenger_id: string;
  name?: string;
  pnr?: string;
  reason?: string;
  amount?: number;
  upi_id?: string;
  status?: string;
  timestamp?: number;
};

const AIRPORTS = [
  "DEL","BOM","BLR","MAA","HYD","COK","GOI","TRV","LKO","CCU",
  "BBI","ATQ","JAI","IXC","IXB","PAT","VNS","UDR","GWL","NAG"
];

export default function RefundManager(): React.ReactElement {
  const [airport, setAirport] = useState<string>(AIRPORTS[0]);
  const [flights, setFlights] = useState<string[]>([]);
  const [flight, setFlight] = useState<string>("");
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchFlights(); }, [airport]);

  useEffect(() => {
    if (flight) fetchRefunds();
    else setRefunds([]);
  }, [flight]);

  async function fetchFlights() {
    setError(null);
    setLoadingFlights(true);
    try {
      const data = await getFlightsByAirport(airport);
      const ids = Array.isArray(data) ? data.map((d: any) => d.flight_id) : [];
      setFlights(ids);
      setFlight(ids[0] || "");
    } catch (e) {
      console.error(e);
      setError("Failed to load flights for airport.");
      setFlights([]);
      setFlight("");
    } finally {
      setLoadingFlights(false);
    }
  }

  async function fetchRefunds() {
    setError(null);
    setLoadingRefunds(true);
    try {
      const data = await getRefundsByFlight(airport, flight);
      setRefunds(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load refund requests.");
      setRefunds([]);
    } finally {
      setLoadingRefunds(false);
    }
  }

  async function handleProcess(paxId: string) {
    if (!window.confirm("Process disbursal and remove request?")) return;
    try {
      await finalizeRefund(airport, flight, paxId);
      // refresh list
      fetchRefunds();
    } catch (e) {
      console.error(e);
      setError("Failed to finalize refund.");
    }
  }

  const filtered = refunds.filter((r) =>
    (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.pnr || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}><Banknote size={18} color="#fff" /></div>
          <h1 style={styles.title}>REFUND<span style={{ color: "#3b82f6" }}>MANAGER</span></h1>
        </div>

        <div style={styles.controls}>
          <select value={airport} onChange={(e) => setAirport(e.target.value)} style={styles.select}>
            {AIRPORTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <select value={flight} onChange={(e) => setFlight(e.target.value)} style={styles.select}>
            <option value="">{loadingFlights ? "Loading..." : flights.length ? "Select Flight" : "No Flights"}</option>
            {flights.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <div style={styles.searchBox}>
            <Search size={14} color="#64748b" />
            <input style={styles.input} placeholder="Search name or PNR" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <button onClick={() => { fetchFlights(); if (flight) fetchRefunds(); }} style={styles.refreshBtn}>
            <RefreshCw size={16} className={(loadingFlights || loadingRefunds) ? "spin" : ""} />
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>PASSENGER</th>
                <th style={styles.th}>PNR</th>
                <th style={styles.th}>DISRUPTION</th>
                <th style={styles.th}>AMOUNT</th>
                <th style={styles.th}>UPI ID</th>
                <th style={{ ...styles.th, textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loadingRefunds ? (
                <tr><td colSpan={6} style={styles.msg}>LOADING...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={styles.msg}>No refund requests.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.passenger_id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.name}>{r.name}</div>
                    <div style={styles.id}>{r.passenger_id}</div>
                  </td>
                  <td style={styles.td}><span style={styles.pnr}>{r.pnr}</span></td>
                  <td style={styles.td}><span style={styles.badge}>{r.reason || "Delayed"}</span></td>
                  <td style={styles.td}><span style={styles.money}>₹{r.amount ?? 0}</span></td>
                  <td style={styles.td}><span style={styles.upi}>{r.upi_id}</span></td>
                  <td style={styles.tdRight}>
                    <button style={styles.approveBtn} onClick={() => handleProcess(r.passenger_id)}>
                      <ShieldCheck size={14} /> PROCESS DISBURSAL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style>{`.spin { animation: rotate 1s linear infinite; } @keyframes rotate { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const styles: any = {
  container: { background: "#020617", minHeight: "100vh", color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace" },
  header: { height: "70px", background: "#0f172a", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "#3b82f6", padding: 8, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 900, margin: 0 },
  controls: { display: "flex", gap: 12, alignItems: "center" },
  select: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #1e293b",
    padding: "6px 10px",
    borderRadius: 6,
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none"
  },
  searchBox: { background: "#020617", border: "1px solid #334155", padding: "6px 12px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 },
  input: { background: "none", border: "none", color: "#fff", outline: "none", fontSize: 13, width: 200 },
  refreshBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer" },
  main: { padding: 24 },
  tableCard: { background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { background: "#1e293b" },
  th: { padding: "14px 18px", textAlign: "left", fontSize: 11, color: "#94a3b8", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { padding: "14px 18px" },
  tdRight: { padding: "14px 18px", textAlign: "right" },
  msg: { textAlign: "center", padding: 40, color: "#475569" },
  name: { fontWeight: 700, fontSize: 14 },
  id: { fontSize: 11, color: "#475569" },
  pnr: { color: "#3b82f6", fontWeight: 700 },
  badge: { background: "#111827", color: "#eab308", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 },
  money: { color: "#22c55e", fontWeight: 700 },
  upi: { fontSize: 12, color: "#94a3b8" },
  approveBtn: { background: "#3b82f6", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  error: { color: "#ff6b6b", padding: 12 }
};