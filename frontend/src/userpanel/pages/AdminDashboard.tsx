import * as React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Bot, Plane, Banknote, ShieldAlert, Zap, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import FlightControl from "./FlightControl";
import DisasterManifest from "./AffectedManifest";
import RefundManager from "./RefundManager";

export default function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = React.useState("FLIGHTS");
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.appContainer}>
      {/* --- MAIN ADMIN SIDEBAR (Now the ONLY sidebar) --- */}
      <aside style={{
        ...styles.sidebar,
        width: isSidebarCollapsed ? '80px' : '300px',
        transition: 'width 0.3s ease',
        position: 'relative'
      }}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            right: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            border: '2px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {isSidebarCollapsed ? 
            <ChevronRight size={16} color="#fff" /> : 
            <ChevronLeft size={16} color="#fff" />
          }
        </button>

        <div style={styles.brandGroup}>
          <div style={styles.logoHex}><Zap size={22} color="#fff" strokeWidth={3} /></div>
          {!isSidebarCollapsed && (
            <div>
              <h1 style={styles.mainTitle}>UDAANSATHI</h1>
              <span style={styles.opsText}>OPS CENTER ADMIN</span>
            </div>
          )}
        </div>

        {!isSidebarCollapsed && <div style={styles.navLabel}>COMMAND MENU</div>}
        <nav style={styles.navGroup}>
          <button 
            onClick={() => setActiveTab("FLIGHTS")} 
            style={{
              ...(activeTab === "FLIGHTS" ? styles.activeNavBtn : styles.navBtn),
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '16px 8px' : '16px'
            }}
            title="Flight Control"
          >
            <Plane size={18} /> {!isSidebarCollapsed && 'FLIGHT CONTROL'}
          </button>

          <button 
            onClick={() => setActiveTab("DISASTER")} 
            style={{
              ...(activeTab === "DISASTER" ? styles.activeNavBtn : styles.navBtn),
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '16px 8px' : '16px'
            }}
            title="Disaster Manifest"
          >
            <ShieldAlert size={18} /> {!isSidebarCollapsed && 'DISASTER MANIFEST'}
          </button>

          <button 
            onClick={() => setActiveTab("REFUNDS")} 
            style={{
              ...(activeTab === "REFUNDS" ? styles.activeNavBtn : styles.navBtn),
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '16px 8px' : '16px'
            }}
            title="Refund Requests"
          >
            <Banknote size={18} /> {!isSidebarCollapsed && 'REFUND REQUESTS'}
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
            <div style={{
              ...styles.adminCard,
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
            }}>
                <UserButton afterSignOutUrl="/Uddan-Sathi/" />
                {!isSidebarCollapsed && (
                  <div style={styles.adminInfo}>
                      <span style={styles.adminName}>{user?.firstName || "Admin"}</span>
                      <span style={styles.adminRole}>SYSTEM COMMANDER</span>
                  </div>
                )}
            </div>
            <button 
              style={{
                ...styles.logoutBtn,
                padding: isSidebarCollapsed ? '10px 8px' : '10px'
              }} 
              onClick={() => window.location.href='/Uddan-Sathi/'}
              title="Exit Terminal"
            >
                <LogOut size={16} /> {!isSidebarCollapsed && 'EXIT TERMINAL'}
            </button>
        </div>
      </aside>

      {/* --- MAIN VIEWPORT --- */}
      <main style={styles.mainArea}>
        <header style={styles.topHeader}>
          <div style={styles.headerStatus}>
            <div style={styles.pulseDot}></div>
            <span style={styles.statusText}>LOGIC UNIT: {activeTab} // SECURE_ENCRYPTION_ACTIVE</span>
          </div>
          
          <div style={styles.clockContainer}>
            <span style={styles.clockLabel}>SYSTEM TIME (UTC)</span>
            <div style={styles.clockValue}>
                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </header>

        <div style={styles.contentWrapper}>
            {activeTab === "FLIGHTS" && <FlightControl />}
            {activeTab === "DISASTER" && <DisasterManifest />}
            {activeTab === "REFUNDS" && <RefundManager />}
        </div>
      </main>
    </div>
  );
}

const styles: any = {
  appContainer: { 
    display: 'flex', 
    backgroundColor: '#05070a', 
    height: '100vh', 
    width: '100vw', // Forces full screen width
    color: '#94a3b8', 
    fontFamily: "'JetBrains Mono', monospace",
    overflow: 'hidden'
  },
  sidebar: { 
    width: '300px', 
    background: '#0a0f18', 
    borderRight: '1px solid #1e293b', 
    padding: '40px 24px', 
    display: 'flex', 
    flexDirection: 'column',
    boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
  },
  logoHex: { 
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
    width: '45px', 
    height: '45px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
  },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px' },
  mainTitle: { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '1px', margin: 0 },
  opsText: { fontSize: '10px', color: '#3b82f6', fontWeight: 'bold', letterSpacing: '2px' },
  navLabel: { fontSize: '10px', color: '#475569', letterSpacing: '2px', marginBottom: '20px', fontWeight: '800' },
  navGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', color: '#64748b', padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.2s' },
  activeNavBtn: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(37, 99, 235, 0.1)', border: 'none', color: '#3b82f6', padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', borderLeft: '4px solid #3b82f6' },
  sidebarFooter: { borderTop: '1px solid #1e293b', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  adminCard: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(30, 41, 59, 0.3)', padding: '12px', borderRadius: '12px' },
  adminName: { display: 'block', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
  adminRole: { fontSize: '9px', color: '#3b82f6', letterSpacing: '1px' },
  logoutBtn: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', fontWeight: 'bold' },
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topHeader: { height: '80px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', background: '#05070a' },
  headerStatus: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusText: { fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', letterSpacing: '1px' },
  pulseDot: { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 12px #22c55e' },
  clockContainer: { textAlign: 'right' },
  clockLabel: { fontSize: '9px', color: '#475569', letterSpacing: '1px' },
  clockValue: { fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '2px' },
  contentWrapper: { flex: 1, padding: '40px', overflowY: 'auto', background: 'radial-gradient(circle at top left, #0a1120 0%, #05070a 100%)' }
};