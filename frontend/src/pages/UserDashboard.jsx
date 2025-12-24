import React, { useState, useEffect } from "react";
import { getFlights } from "../services/api";
import { useUser, UserButton } from "@clerk/clerk-react";

export default function PassengerDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("search"); // "search" or "mybookings"
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ src: "", dest: "" });
  const [pnrInput, setPnrInput] = useState("");
  const [myFlight, setMyFlight] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());

  // Real-time synchronization with Ops-Center
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFlights();
        if (res.ok) {
          const data = Array.isArray(res.data) 
            ? res.data 
            : Object.entries(res.data || {}).map(([id, val]) => ({ id, ...val }));
          setFlights(data);
          setLastSync(new Date());
          
          // Live status update for active booking
          if (myFlight) {
            const updated = data.find(f => f.id === myFlight.id);
            if (updated) setMyFlight(updated);
          }
        }
      } catch (err) { console.error("Sync Error:", err); }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [myFlight]);

  const handlePnrSearch = (e) => {
    e.preventDefault();
    const found = flights.find(f => f.id === pnrInput.toUpperCase());
    if (found) setMyFlight(found);
    else alert("No mission record found for this ID.");
  };

  const filteredSearch = flights.filter(f => 
    f.source.toLowerCase().includes(searchQuery.src.toLowerCase()) &&
    f.destination.toLowerCase().includes(searchQuery.dest.toLowerCase())
  );

  return (
    <div style={styles.app}>
      {/* 1. GLOBAL NAVIGATION */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.brand}>UDAANSATHI ✈️</div>
          <div style={styles.tabSwitcher}>
            <button 
              onClick={() => setActiveTab("search")} 
              style={activeTab === "search" ? styles.activeTabBtn : styles.tabBtn}
            >SEARCH FLIGHTS</button>
            <button 
              onClick={() => setActiveTab("mybookings")} 
              style={activeTab === "mybookings" ? styles.activeTabBtn : styles.tabBtn}
            >MY BOOKINGS</button>
          </div>
          <div style={styles.userProfile}>
            <span style={styles.syncText}>Sync: {lastSync.toLocaleTimeString()}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* SECTION: SEARCH FLIGHTS */}
        {activeTab === "search" && (
          <div style={styles.contentFade}>
            <div style={styles.searchHeader}>
              <h1>Find Your Next Mission</h1>
              <p>Explore real-time availability across the UdaanSathi network.</p>
            </div>
            
            <div style={styles.searchFilterBar}>
              <div style={styles.inputBox}>
                <label>FROM</label>
                <input placeholder="e.g. DEL" onChange={(e) => setSearchQuery({...searchQuery, src: e.target.value})} />
              </div>
              <div style={styles.inputBox}>
                <label>TO</label>
                <input placeholder="e.g. BOM" onChange={(e) => setSearchQuery({...searchQuery, dest: e.target.value})} />
              </div>
              <div style={styles.searchStats}>
                <strong>{filteredSearch.length}</strong> Flights Found
              </div>
            </div>

            <div style={styles.flightGrid}>
              {filteredSearch.map(f => (
                <div key={f.id} style={styles.flightCard}>
                  <div style={styles.cardTop}>
                    <span style={styles.carrier}>{f.airline_name || "IndiGo"}</span>
                    <span style={styles.fId}>{f.id}</span>
                  </div>
                  <div style={styles.cardRoute}>
                    <h3>{f.source} ➜ {f.destination}</h3>
                    <p>{f.departure_time} | ₹{f.price || "4,999"}*</p>
                  </div>
                  <div style={{...styles.statusTag, color: f.status === 'Cancelled' ? '#ef4444' : '#22c55e'}}>
                    ● {f.status || "ON TIME"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MY BOOKINGS */}
        {activeTab === "mybookings" && (
          <div style={styles.contentFade}>
            {!myFlight ? (
              <div style={styles.pnrGateway}>
                <h2>Manage Your Journey</h2>
                <p>Enter your Flight ID to access your digital boarding pass.</p>
                <form onSubmit={handlePnrSearch} style={styles.pnrForm}>
                  <input 
                    style={styles.pnrInput} 
                    placeholder="Enter Flight ID (e.g. 6E203)" 
                    onChange={(e) => setPnrInput(e.target.value)}
                  />
                  <button style={styles.pnrBtn}>RETRIEVE BOOKING</button>
                </form>
              </div>
            ) : (
              <div style={styles.ticketSection}>
                <div style={styles.ticketHeader}>
                   <h2>Your Digital Boarding Pass</h2>
                   <button onClick={() => setMyFlight(null)} style={styles.resetBtn}>Change Flight</button>
                </div>
                
                {/* PREMIUM TICKET UI */}
                <div style={{...styles.boardingPass, borderLeft: myFlight.status === 'Cancelled' ? '10px solid #ef4444' : '10px solid #001b94'}}>
                   <div style={styles.passMain}>
                      <div style={styles.passCity}>
                        <h1>{myFlight.source}</h1>
                        <p>Origin</p>
                      </div>
                      <div style={styles.passVector}>
                        <div style={styles.vectorLine}></div>
                        <div style={styles.vectorPlane}>✈</div>
                        <div style={styles.vectorLine}></div>
                      </div>
                      <div style={styles.passCity}>
                        <h1>{myFlight.destination}</h1>
                        <p>Destination</p>
                      </div>
                   </div>
                   <div style={styles.passDetails}>
                      <div><label>FLIGHT</label><p>{myFlight.id}</p></div>
                      <div><label>DEPARTURE</label><p>{myFlight.departure_time}</p></div>
                      <div><label>GATE</label><p>T2 - 04</p></div>
                      <div><label>SEAT</label><p>14A</p></div>
                   </div>

                   {/* DISASTER MODE: DISRUPTION HANDLING */}
                   {myFlight.status === 'Cancelled' && (
                     <div style={styles.disasterMode}>
                        <div style={styles.disasterTitle}>⚠️ FLIGHT INTERRUPTED</div>
                        <p>Reason: {myFlight.reason || "Operational Delay"}. Assistance enabled.</p>
                        
                        <div style={styles.assistanceGrid}>
                           <div style={styles.altBox}>
                              <h4>🚆 Rail Alternative</h4>
                              <p>Rajdhani Express (Seat Avail: High)</p>
                           </div>
                           <div style={styles.altBox}>
                              <h4>🏨 Accommodation</h4>
                              <p>Voucher for Airport Plaza enabled</p>
                           </div>
                        </div>
                        <div style={styles.disasterActions}>
                           <button style={styles.refundBtn}>Initiate Full Refund</button>
                           <button style={styles.helpBtn}>Contact Helpdesk</button>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { backgroundColor: "#f0f3f7", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  navbar: { backgroundColor: "#001b94", color: "#fff", padding: "15px 0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" },
  brand: { fontSize: "22px", fontWeight: "900", letterSpacing: "1px" },
  tabSwitcher: { display: "flex", gap: "10px" },
  tabBtn: { background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontWeight: "600", cursor: "pointer", fontSize: "13px", padding: "10px 15px" },
  activeTabBtn: { background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontWeight: "800", cursor: "pointer", fontSize: "13px", padding: "10px 15px", borderRadius: "6px" },
  userProfile: { display: "flex", alignItems: "center", gap: "15px" },
  syncText: { fontSize: "10px", opacity: 0.7 },

  main: { maxWidth: "1200px", margin: "40px auto", padding: "0 20px" },
  contentFade: { animation: "fadeIn 0.5s ease" },
  searchHeader: { marginBottom: "30px" },
  searchFilterBar: { background: "#fff", padding: "30px", borderRadius: "12px", display: "flex", gap: "20px", alignItems: "flex-end", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "40px" },
  inputBox: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  searchStats: { padding: "12px", background: "#f8fafc", borderRadius: "8px", fontSize: "13px" },
  flightGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" },
  flightCard: { background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", transition: "transform 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontWeight: "bold", color: "#001b94" },
  statusTag: { fontSize: "12px", fontWeight: "bold", marginTop: "15px" },

  pnrGateway: { maxWidth: "500px", margin: "100px auto", textAlign: "center", background: "#fff", padding: "50px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" },
  pnrForm: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" },
  pnrInput: { padding: "15px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outline: "none", textAlign: "center" },
  pnrBtn: { background: "#001b94", color: "#fff", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },

  boardingPass: { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" },
  passMain: { padding: "60px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  passCity: { textAlign: "center" },
  passVector: { flex: 1, display: "flex", alignItems: "center", padding: "0 40px", gap: "15px" },
  vectorLine: { flex: 1, height: "1px", background: "#cbd5e0", borderStyle: "dashed" },
  vectorPlane: { color: "#001b94", fontSize: "24px" },
  passDetails: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "30px", background: "#f8fafc", borderTop: "1px solid #eee", textAlign: "center" },

  disasterMode: { padding: "40px", background: "#fff5f5", borderTop: "2px solid #ef4444" },
  disasterTitle: { color: "#ef4444", fontWeight: "900", fontSize: "18px", marginBottom: "15px" },
  assistanceGrid: { display: "flex", gap: "20px", margin: "20px 0" },
  altBox: { flex: 1, background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #fee2e2", fontSize: "13px" },
  disasterActions: { display: "flex", gap: "15px" },
  refundBtn: { flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "bold" },
  helpBtn: { flex: 1, background: "#001b94", color: "#fff", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "bold" },
  resetBtn: { background: "none", border: "none", color: "#64748b", textDecoration: "underline", cursor: "pointer" }
};