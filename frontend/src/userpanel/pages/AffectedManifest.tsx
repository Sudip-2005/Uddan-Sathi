import * as React from "react";
import { 
  ShieldAlert, 
  Users, 
  Megaphone, 
  Hotel, 
  Plane, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  Clock
} from "lucide-react";

// Mock Data Service (Replace with your actual api.js imports)
// import { getAffectedPassengers, sendNotification, issueVoucher } from "../services/api";


// Simple Error Boundary to prevent navigation crash
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any, info: any) { console.error("ErrorBoundary caught:", err, info); }
  reset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: "#fff", background: "#0b1220", minHeight: 300 }}>
          <h3 style={{ color: "#ff6b6b" }}>Component failed to render</h3>
          <p>Try reloading the manifest.</p>
          <button onClick={this.reset} style={{ padding: "8px 12px", borderRadius: 6 }}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DisasterManifest() {
  const [affectedPax, setAffectedPax] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [stats, setStats] = React.useState({ total: 0, critical: 0, rebooked: 0 });

  // SIMULATED DATA FETCHING (Replace with actual API call)
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const SUPPORTED_AIRPORTS = [
    "AMS", "BKK", "BLR", "BOM", "CAN", "CCU", "CDG", "DEL", "DFW",
    "DOH", "DXB", "FRA", "HKG", "HND", "ICN", "IST", "JFK", "LAX",
    "LHR", "MAA", "ORD", "SFO", "SIN", "SYD", "YYZ"
  ];

  const loadManifest = async () => {
    setLoading(true);
    try {
      const aggregated: any[] = [];

      await Promise.all(
        SUPPORTED_AIRPORTS.map(async (ap) => {
          try {
            const resp = await fetch(`${API_BASE}/flights?airport=${encodeURIComponent(ap)}`);
            if (!resp.ok) return;
            const body = await resp.json();
            const flights = body?.data || [];
            flights.forEach((f: any) => {
              const passengers = f.passengers || {};
              Object.entries(passengers).forEach(([pnr, pInfo]: any) => {
                const passengerStatus = (pInfo?.status || f?.status || "").toString();
                if (/cancelled/i.test(passengerStatus) || /delayed/i.test(passengerStatus)) {
                  aggregated.push({
                    id: String(pnr),
                    name: pInfo?.name || pInfo?.fullName || "Unknown",
                    pnr: String(pnr),
                    flight: f?.id || f?.flight_number || "Unknown",
                    status: passengerStatus || f?.status || "Unknown",
                    origin: f?.source || ap,
                    dest: f?.destination || f?.dest_city || "",
                    tier: pInfo?.tier || pInfo?.loyalty_tier || "Economy",
                    contact: pInfo?.phone || pInfo?.contact || "",
                    email: pInfo?.email || "",
                    needs_hotel: !!pInfo?.needs_hotel,
                    scheduled_departure: f?.dep_time || f?.departure_time || null
                  });
                }
              });
            });
          } catch (e) {
            console.error("Failed to fetch for airport", ap, e);
          }
        })
      );

      setAffectedPax(aggregated);
      setStats({
        total: aggregated.length,
        critical: aggregated.filter(p => /cancelled/i.test(p.status)).length,
        rebooked: 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadManifest(); }, []);

  // HANDLERS
  const handleNotify = (id: string) => {
    alert(`📢 ALERT SENT to Passenger ${id}\n"Your flight status has changed. Please check app."`);
    // await sendNotification(id, "Flight Disruption Alert");
  };

  const handleVoucher = (id: string) => {
    alert(`🏨 HOTEL VOUCHER ISSUED for Passenger ${id}`);
    // await issueVoucher(id, "Hotel + Meal");
    // Update local state to show "Voucher Issued" styling if needed
  };

  const handleRebook = (id: string) => {
    alert(`✈️ AUTO-REBOOKING initiated for Passenger ${id}`);
    // await rebookPassenger(id);
    setStats(prev => ({ ...prev, rebooked: prev.rebooked + 1 }));
  };

  // Filter Logic (safe access)
  const q = (filter || "").trim().toLowerCase();
  const filteredList = Array.isArray(affectedPax) ? affectedPax.filter(p => {
    const name = String(p?.name || "").toLowerCase();
    const pnr = String(p?.pnr || "").toLowerCase();
    const flight = String(p?.flight || "").toLowerCase();
    if (!q) return true;
    return name.includes(q) || pnr.includes(q) || flight.includes(q);
  }) : [];
  
  return (
    <ErrorBoundary>
    <div style={{ ...styles.container, width: '100%' }}>
      {/* 1. TOP CRISIS HEADER */}
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <div style={styles.iconBox}>
            <ShieldAlert size={24} color="#ef4444" />
          </div>
          <div>
            <h1 style={styles.title}>DISASTER <span style={{color:'#ef4444'}}>MANIFEST</span></h1>
            <span style={styles.subtitle}>CRISIS MANAGEMENT PROTOCOL ACTIVE</span>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>AFFECTED PAX</span>
            <span style={styles.statValue}>{stats.total}</span>
          </div>
          <div style={{...styles.statCard, borderColor: '#ef4444'}}>
            <span style={{...styles.statLabel, color:'#ef4444'}}>CRITICAL (CX)</span>
            <span style={{...styles.statValue, color:'#ef4444'}}>{stats.critical}</span>
          </div>
          <div style={{...styles.statCard, borderColor: '#22c55e'}}>
            <span style={{...styles.statLabel, color:'#22c55e'}}>REBOOKED</span>
            <span style={{...styles.statValue, color:'#22c55e'}}>{stats.rebooked}</span>
          </div>
        </div>

        <button onClick={loadManifest} style={styles.refreshBtn}>
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </header>

      {/* 2. SEARCH & CONTROLS */}
      <div style={styles.controlsBar}>
        <div style={styles.searchWrapper}>
          <Search size={16} color="#64748b" />
          <input 
            style={styles.searchInput} 
            placeholder="SEARCH PNR, NAME OR FLIGHT NO..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div style={styles.massActions}>
            <button style={styles.massBtn} onClick={() => alert("Broadcasting to all 5 users...")}>
                <Megaphone size={14} /> BROADCAST ALL
            </button>
            <button style={{...styles.massBtn, background:'#ef444420', color:'#ef4444', border:'1px solid #ef4444'}}>
                <AlertTriangle size={14} /> DECLARE EMERGENCY
            </button>
        </div>
      </div>

      {/* 3. MANIFEST TABLE */}
      <main style={styles.main}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>PASSENGER IDENTITY</th>
                <th style={styles.th}>FLIGHT STATUS</th>
                <th style={styles.th}>CONTACT POINT</th>
                <th style={styles.th}>IMPACT LEVEL</th>
                <th style={styles.thRight}>INTERVENTION</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} style={{padding:20}}>Loading…</td></tr>
              )}
              {!loading && filteredList.length === 0 && (
                <tr><td colSpan={5} style={{padding:20}}>No affected passengers found.</td></tr>
              )}
              {filteredList.map((p) => {
                 const statusStr = String(p?.status || "");
                 const isCancelled = /cancel/i.test(statusStr);
                 const isDelayed = /delay/i.test(statusStr);
                 return (
                  <tr key={p.id} style={styles.tr}>
                   {/* PASSENGER */}
                   <td style={styles.td}>
                     <div style={styles.paxName}>{p.name}</div>
                     <div style={styles.paxMeta}>
                         <span style={styles.pnr}>{p.pnr}</span> • 
                         <span style={{
                             ...styles.tierBadge, 
                             color: p.tier === 'PLATINUM' ? '#a855f7' : p.tier === 'GOLD' ? '#eab308' : '#94a3b8'
                         }}> {p.tier}</span>
                     </div>
                   </td>
 
                   {/* FLIGHT */}
                   <td style={styles.td}>
                     <div style={styles.flightCode}>{p.flight}</div>
                     <div style={styles.route}>{p.origin} ➝ {p.dest}</div>
                   </td>
 
                   {/* CONTACT */}
                   <td style={styles.td}>
                     <div style={styles.contactItem}>{p.email}</div>
                     <div style={styles.contactItem}>{p.contact}</div>
                   </td>
 
                   {/* STATUS/IMPACT */}
                   <td style={styles.td}>
                    <div style={{
                        ...styles.statusBadge,
                        background: isCancelled ? '#ef444420' : isDelayed ? '#f59e0b20' : '#33415520',
                        color: isCancelled ? '#ef4444' : isDelayed ? '#f59e0b' : '#94a3b8'
                    }}>
                        {isCancelled ? <AlertTriangle size={12}/> : isDelayed ? <Clock size={12}/> : null}
                        {statusStr || 'Unknown'}
                    </div>
                     {p.needs_hotel && (
                         <div style={styles.hotelTag}><Hotel size={10}/> NEEDS HOTEL</div>
                     )}
                   </td>
 
                   {/* ACTIONS */}
                   <td style={styles.tdRight}>
                     <div style={styles.actionGroup}>
                       <button title="Issue Voucher" onClick={() => handleVoucher(p.id)} style={styles.btnVoucher}>
                         <Hotel size={14} /> VOUCHER
                       </button>
                       <button title="Rebook Flight" onClick={() => handleRebook(p.id)} style={styles.btnRebook}>
                         <Plane size={14} /> REBOOK
                       </button>
                       <button title="Notify" onClick={() => handleNotify(p.id)} style={styles.btnNotify}>
                         <Megaphone size={14} />
                       </button>
                     </div>
                   </td>
                 </tr>
               );
             })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Styles for 'spin' animation in global css or inline here */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
    </ErrorBoundary>
   );
 }
 
 // --- STYLES (MATCHING FLIGHT CONTROL THEME) ---
const styles: any = {
  container: { backgroundColor: '#020617', minHeight: '100vh', width: '100vw', color: '#f8fafc', fontFamily: "'JetBrains Mono', monospace", display:'flex', flexDirection:'column' },
  
  // Header
  header: { height: '80px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', background: '#0f172a' },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconBox: { width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' },
  title: { fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '1px', lineHeight: '1' },
  subtitle: { fontSize: '10px', color: '#ef4444', fontWeight: 'bold', letterSpacing: '2px' },
  
  statsRow: { display: 'flex', gap: '20px' },
  statCard: { border: '1px solid #334155', borderRadius: '8px', padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', background: '#020617' },
  statLabel: { fontSize: '9px', fontWeight: 'bold', color: '#64748b', letterSpacing: '1px' },
  statValue: { fontSize: '18px', fontWeight: 'bold', color: '#fff' },

  refreshBtn: { background: 'none', border: '1px solid #334155', borderRadius: '8px', width: '40px', height: '40px', color: '#94a3b8', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' },

  // Controls
  controlsBar: { padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchWrapper: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', width: '400px' },
  searchInput: { background: 'none', border: 'none', color: '#fff', fontSize: '13px', width: '100%', outline: 'none', fontFamily: 'inherit' },
  
  massActions: { display:'flex', gap:'15px' },
  massBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 20px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },

  // Main Table
  main: { flex: 1, padding: '0 40px 40px 40px', overflowY: 'hidden', display:'flex', flexDirection:'column' },
  tableWrapper: { background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', flex: 1, overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  trHead: { position: 'sticky', top: 0, background: '#1e293b', zIndex: 10 },
  th: { padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' },
  thRight: { padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' },
  
  tr: { borderBottom: '1px solid #1e293b' },
  td: { padding: '16px 24px', verticalAlign: 'middle' },
  tdRight: { padding: '16px 24px', verticalAlign: 'middle', textAlign: 'right' },

  // Cell Content
  paxName: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  paxMeta: { fontSize: '11px', color: '#64748b', marginTop: '4px' },
  pnr: { fontFamily: 'monospace', color: '#3b82f6' },
  tierBadge: { fontWeight: 'bold', fontSize: '10px' },
  
  flightCode: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  route: { fontSize: '11px', color: '#64748b' },
  
  contactItem: { fontSize: '12px', color: '#cbd5e1' },
  
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
  hotelTag: { marginTop: '6px', fontSize: '10px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' },

  // Buttons
  actionGroup: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  btnVoucher: { background: '#020617', border: '1px solid #334155', color: '#f59e0b', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  btnRebook: { background: '#020617', border: '1px solid #334155', color: '#3b82f6', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  btnNotify: { background: '#020617', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
};