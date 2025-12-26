import React, { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import DisasterModePage from "./DisasterModePage";

/* ===================== DASHBOARD ===================== */

export default function PassengerDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔔 Notification state
  const [notifications, setNotifications] = useState([]);
  const [hasDisaster, setHasDisaster] = useState(false);

  // DEMO PNR (map to user later)
  const userPNR = "PNR001";

  /* ---------- FETCH FLIGHTS ---------- */
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/flights");
        const json = await res.json();
        if (json.ok) setFlights(json.data || []);
      } catch (err) {
        console.error("Flights fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  /* ---------- FETCH NOTIFICATIONS ---------- */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/notifications/${userPNR}`
        );
        const json = await res.json();

        if (json.ok) {
          setNotifications(json.data || []);
          const cancelled = json.data?.some(
            (n) => n.type === "CANCELLED"
          );
          setHasDisaster(cancelled);
        }
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- UI ---------- */
  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>✈</div>
          <div style={styles.logoText}>UdaanSathi</div>
        </div>

        <nav style={styles.nav}>
          <SidebarButton label="Dashboard" icon="📊" active />
          <SidebarButton label="Flights" icon="✈️" />
          <SidebarButton label="Support" icon="🛟" disabled />
        </nav>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
        {/* TOPBAR */}
        <header style={styles.topbar}>
          <div>
            <p style={styles.topbarSub}>
              Welcome back,
            </p>
            <p style={styles.topbarTitle}>
              {user?.fullName || "Passenger"}
            </p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        {/* CONTENT */}
        <main style={styles.content}>
          {/* 🚨 DISASTER MODE */}
          {hasDisaster && (
            <DisasterModePage notifications={notifications} />
          )}

          <div style={styles.grid}>
            {/* LEFT COLUMN */}
            <div>
              <h3 style={styles.sectionTitle}>
                Available Flights
              </h3>

              {loading && <p>Loading flights...</p>}

              {!loading && flights.length === 0 && (
                <p>No flights found</p>
              )}

              {flights.map((f) => (
                <FlightCard key={f.id} flight={f} />
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* 🔔 NOTIFICATIONS */}
              <div style={styles.notificationBox}>
                <div style={styles.notificationTitle}>
                  🔔 Notifications
                </div>

                {notifications.length === 0 && (
                  <div style={styles.notificationEmpty}>
                    No notifications
                  </div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      ...styles.notificationItem,
                      ...(n.type === "CANCELLED"
                        ? styles.notificationDanger
                        : {}),
                    }}
                  >
                    <div style={styles.notificationHeader}>
                      {n.type === "CANCELLED"
                        ? "🚨 Flight Cancelled"
                        : "ℹ Update"}
                    </div>
                    <div>{n.message}</div>
                    <div style={styles.notificationTime}>
                      {new Date(
                        n.created_at
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* DISASTER CENTER */}
              <button
                style={styles.disasterBtn}
                onClick={() =>
                  navigate("/dashboard/disaster")
                }
              >
                Open Disaster Center
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function SidebarButton({ icon, label, active, disabled }) {
  return (
    <div
      style={{
        ...styles.sidebarBtn,
        ...(active ? styles.sidebarActive : {}),
        ...(disabled ? styles.sidebarDisabled : {}),
      }}
    >
      <span>{icon}</span>
      {label}
    </div>
  );
}

function FlightCard({ flight }) {
  return (
    <div style={styles.flightCard}>
      <div>
        <strong>
          {flight.source} → {flight.destination}
        </strong>
        <div style={styles.flightSub}>
          {flight.airline_name}
        </div>
      </div>

      <span
        style={{
          ...styles.flightStatus,
          ...(flight.status === "Cancelled"
            ? styles.statusCancelled
            : styles.statusOnTime),
        }}
      >
        {flight.status || "On Time"}
      </span>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "system-ui",
  },
  sidebar: {
    width: 240,
    background: "#020617",
    color: "#e2e8f0",
    padding: 20,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  logoIcon: {
    background: "#0ea5e9",
    borderRadius: 10,
    padding: "6px 10px",
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sidebarBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  sidebarActive: {
    background: "#020617",
    boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
  },
  sidebarDisabled: {
    opacity: 0.4,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    background: "#fff",
    padding: "16px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
  },
  topbarSub: {
    margin: 0,
    fontSize: 12,
    color: "#64748b",
  },
  topbarTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  flightCard: {
    background: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
  },
  flightSub: {
    fontSize: 12,
    color: "#64748b",
  },
  flightStatus: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  statusCancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
  },
  statusOnTime: {
    background: "#dcfce7",
    color: "#166534",
  },
  notificationBox: {
    background: "#fff",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
    marginBottom: 12,
  },
  notificationTitle: {
    fontWeight: 700,
    marginBottom: 8,
  },
  notificationEmpty: {
    fontSize: 12,
    color: "#64748b",
  },
  notificationItem: {
    background: "#f8fafc",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 12,
    marginBottom: 8,
    border: "1px solid #e2e8f0",
  },
  notificationDanger: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
  },
  notificationHeader: {
    fontWeight: 700,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 10,
    marginTop: 4,
    color: "#64748b",
  },
  disasterBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 14,
    border: "none",
    background: "#020617",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
