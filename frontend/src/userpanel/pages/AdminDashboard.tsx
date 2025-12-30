import * as React from "react";
import { getFlights, addFlight, cancelFlight } from "../services/api";
import { useUser, UserButton } from "@clerk/clerk-react";
import DisasterModePage from './DisasterModePage';

export default function AdminDashboard() {
  const { user } = useUser();
  const [flights, setFlights] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Database-aligned form state
  const [form, setForm] = React.useState({
    flight_number: "",
    airline_name: "",
    airline_code: "",
    source: "",
    destination: "",
    departure_time: "",
    price: "",
    seats_available: ""
  });

  React.useEffect(() => {
    loadFlights();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadFlights = async () => {
    setLoading(true);
      try {
      const res = await getFlights();
      if (res.ok && res.data) {
        // Converting keyed object to array for mapping
        const flightArray = Object.entries(res.data).map(([id, details]) => {
          const det = details as Record<string, any>;
          return { id, ...det };
        });
        setFlights(flightArray);
      }
    } catch (err) {
      console.error("Ops Center Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const disasterList = flights.filter((f) => f.status === 'Cancelled' || f.status === 'Diverted');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      // In professional ops, status defaults to 'Scheduled'
      const payload = { ...form, status: "Scheduled" };
      await addFlight(payload);
      // Reset form
      setForm({
        flight_number: "", airline_name: "", airline_code: "",
        source: "", destination: "", departure_time: "",
        price: "", seats_available: ""
      });
      loadFlights();
    } catch (err) {
      alert("Deployment Failed: " + err.message);
    }
  };

  const handleTerminate = async (flightId) => {
    const reason = window.prompt(`CRITICAL: Enter termination reason for ${flightId}:`);
    if (!reason) return;
    try {
      await cancelFlight(flightId, {
        reason,
        cancelled_by: user?.fullName || "SYSTEM_ADMIN",
        cancel_time: new Date().toISOString()
      });
      loadFlights();
    } catch (err) {
      alert("Termination Error: " + err.message);
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* --- HUD: SYSTEM STATUS BAR --- */}
      <header style={styles.topBar}>
        <div style={styles.brandGroup}>
          <div style={styles.logoHex}>U</div>
          <div>
            <h1 style={styles.mainTitle}>UDAANSATHI <span style={styles.opsText}>OPS-CENTER</span></h1>
            <div style={styles.statusIndicator}>
              <span style={styles.pulseDot}></span>
              <span style={styles.statusText}>ALL SYSTEMS OPERATIONAL // DATA-SYNC: ACTIVE</span>
            </div>
          </div>
        </div>

        <div style={styles.clockCenter}>
          <div style={styles.clockLabel}>GLOBAL OPERATIONS TIME (UTC)</div>
          <div style={styles.clockValue}>{currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
        </div>

        <div style={styles.adminControl}>
          <div style={styles.adminMeta}>
            <span style={styles.adminName}>{user?.fullName}</span>
            <span style={styles.adminRole}>COMMANDER</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div style={styles.gridMain}>
        {/* --- ZONE 01: MISSION DEPLOYMENT (LEFT) --- */}
        <aside style={styles.sidePanel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelIcon}>⊕</span>
            <h2 style={styles.panelTitle}>MISSION DEPLOYMENT</h2>
          </div>
          
          <form onSubmit={handleAddFlight} style={styles.deploymentForm}>
            <div style={styles.formSection}>
              <label style={styles.sectionLabel}>IDENTIFICATION</label>
              <div style={styles.inputGrid}>
                <div style={styles.inputBox}>
                  <label style={styles.label}>FLIGHT ID</label>
                  <input style={styles.input} name="flight_number" value={form.flight_number} placeholder="6E203" onChange={handleChange} required />
                </div>
                <div style={styles.inputBox}>
                  <label style={styles.label}>CODE</label>
                  <input style={styles.input} name="airline_code" value={form.airline_code} placeholder="6E" onChange={handleChange} required />
                </div>
              </div>
              <div style={{...styles.inputBox, marginTop: '10px'}}>
                <label style={styles.label}>CARRIER NAME</label>
                <input style={styles.input} name="airline_name" value={form.airline_name} placeholder="IndiGo Airlines" onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.formSection}>
              <label style={styles.sectionLabel}>LOGISTICS</label>
              <div style={styles.inputGrid}>
                <div style={styles.inputBox}>
                  <label style={styles.label}>ORIGIN</label>
                  <input style={styles.input} name="source" value={form.source} placeholder="DEL" onChange={handleChange} required />
                </div>
                <div style={styles.inputBox}>
                  <label style={styles.label}>DEST</label>
                  <input style={styles.input} name="destination" value={form.destination} placeholder="BOM" onChange={handleChange} required />
                </div>
              </div>
              <div style={{...styles.inputBox, marginTop: '10px'}}>
                <label style={styles.label}>DEPARTURE TIME</label>
                <input style={styles.input} name="departure_time" type="time" value={form.departure_time} onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.formSection}>
              <label style={styles.sectionLabel}>INVENTORY</label>
              <div style={styles.inputGrid}>
                <div style={styles.inputBox}>
                  <label style={styles.label}>PRICE (INR)</label>
                  <input style={styles.input} name="price" type="number" value={form.price} placeholder="4999" onChange={handleChange} required />
                </div>
                <div style={styles.inputBox}>
                  <label style={styles.label}>SEATS</label>
                  <input style={styles.input} name="seats_available" type="number" value={form.seats_available} placeholder="180" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <button type="submit" style={styles.primaryBtn}>PUSH TO LIVE NETWORK</button>
          </form>
        </aside>

        {/* --- ZONE 02: LIVE OPERATIONS MONITOR (RIGHT) --- */}
        <section style={styles.mainMonitor}>
          <div style={styles.panelHeader}>
             <span style={styles.panelIcon}>☷</span>
             <h2 style={styles.panelTitle}>LIVE MISSION MONITORING</h2>
          </div>

          {disasterList.length > 0 && React.createElement(DisasterModePage as any, { flights: disasterList })}
          <div style={styles.monitorTable}>
             <div style={styles.tableHead}>
               <span>CALLSIGN</span>
               <span>SECTOR</span>
               <span>SCHEDULE</span>
               <span>CARRIER</span>
               <span>ACTION</span>
             </div>
             <div style={styles.tableScroll}>
               {loading ? (
                 <div style={styles.loadingState}>SYNCING WITH FIREBASE...</div>
               ) : (
                 flights.map(f => (
                   <div key={f.id} style={styles.tableRow}>
                     <span style={styles.callsign}>{f.id}</span>
                     <span style={styles.sector}>{f.source} ➔ {f.destination}</span>
                     <span style={styles.time}>{f.departure_time}</span>
                     <span style={styles.carrier}>{f.airline_name}</span>
                     <button onClick={() => handleTerminate(f.id)} style={styles.abortBtn}>TERMINATE</button>
                   </div>
                 ))
               )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: { backgroundColor: '#05060b', minHeight: '100vh', padding: '20px', color: '#e2e8f0', fontFamily: "'JetBrains Mono', 'Inter', monospace" },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', padding: '15px 30px', borderRadius: '16px', border: '1px solid #1e293b', marginBottom: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  logoHex: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontWeight: '900', fontSize: '22px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  mainTitle: { fontSize: '20px', fontWeight: '800', letterSpacing: '3px', margin: 0, color: '#fff' },
  opsText: { color: '#3b82f6', fontWeight: '300' },
  statusIndicator: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' },
  pulseDot: { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' },
  statusText: { fontSize: '9px', color: '#64748b', letterSpacing: '1px' },
  clockCenter: { textAlign: 'center' },
  clockLabel: { fontSize: '9px', color: '#475569', letterSpacing: '2px', marginBottom: '4px' },
  clockValue: { fontSize: '26px', fontWeight: '800', letterSpacing: '3px', color: '#3b82f6', textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' },
  adminControl: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminMeta: { textAlign: 'right' },
  adminName: { display: 'block', fontSize: '14px', fontWeight: '700' },
  adminRole: { fontSize: '10px', color: '#3b82f6', letterSpacing: '2px' },
  gridMain: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '25px' },
  sidePanel: { background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: '1px solid #1e293b', padding: '24px', height: 'fit-content', position: 'sticky' as React.CSSProperties['position'], top: '110px' },
  mainMonitor: { background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: '1px solid #1e293b', padding: '24px' },
  panelHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' },
  panelIcon: { color: '#3b82f6', fontSize: '22px' },
  panelTitle: { fontSize: '12px', fontWeight: '800', letterSpacing: '2px', margin: 0, color: '#94a3b8' },
  deploymentForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formSection: { background: 'rgba(2, 6, 23, 0.5)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' },
  sectionLabel: { fontSize: '9px', fontWeight: '900', color: '#3b82f6', letterSpacing: '2px', marginBottom: '15px', display: 'block' },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputBox: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '9px', fontWeight: '700', color: '#475569', letterSpacing: '1px' },
  input: { background: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  primaryBtn: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)', marginTop: '10px' },
  monitorTable: { width: '100%' },
  tableHead: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1.2fr 0.8fr', padding: '15px 20px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', fontSize: '11px', fontWeight: '900', color: '#64748b', letterSpacing: '2px' },
  tableScroll: { maxHeight: '65vh', overflowY: 'auto', marginTop: '10px' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1.2fr 0.8fr', padding: '20px', borderBottom: '1px solid #1e293b', alignItems: 'center', transition: '0.3s' },
  callsign: { color: '#3b82f6', fontWeight: '900', fontSize: '16px' },
  sector: { fontWeight: '600', color: '#f8fafc', fontSize: '14px' },
  time: { color: '#94a3b8', fontSize: '14px' },
  carrier: { fontSize: '12px', color: '#64748b' },
  abortBtn: { background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '8px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', cursor: 'pointer', transition: '0.3s' },
  loadingState: { textAlign: 'center', padding: '40px', color: '#3b82f6', letterSpacing: '2px', fontSize: '12px' }
};