import React from "react";

export default function DisasterModePage({ notifications = [] }) {
  // Always ensure notifications is an array
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }

  // Find latest cancelled notification safely
  const cancelledNotification = notifications
    .filter(
      (n) =>
        n &&
        typeof n === "object" &&
        n.type &&
        n.type.toLowerCase() === "cancelled"
    )
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    )[0];

  // If no cancellation exists, render nothing
  if (!cancelledNotification) {
    return null;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.icon}>🚨</div>
          <div>
            <h2 style={styles.title}>Flight Cancelled</h2>
            <p style={styles.subtitle}>
              We’re here to help you
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div style={styles.details}>
          <InfoRow
            label="Flight ID"
            value={cancelledNotification.flight_id || "—"}
          />
          <InfoRow label="Status" value="Cancelled" danger />
          <InfoRow
            label="Updated At"
            value={
              cancelledNotification.created_at
                ? new Date(
                    cancelledNotification.created_at
                  ).toLocaleString()
                : "—"
            }
          />
        </div>

        {/* MESSAGE */}
        <div style={styles.messageBox}>
          {cancelledNotification.message ||
            "Your flight has been cancelled."}
        </div>

        {/* NEXT STEPS */}
        <div style={styles.nextSteps}>
          <h4 style={styles.nextTitle}>
            What you can do next
          </h4>
          <ul style={styles.list}>
            <li>✔ View alternative travel options</li>
            <li>✔ Request refund or reschedule</li>
            <li>✔ Contact support for assistance</li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button style={styles.primaryBtn}>
            View Alternatives
          </button>
          <button style={styles.secondaryBtn}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SUB COMPONENT ---------- */

function InfoRow({ label, value, danger }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span
        style={{
          ...styles.infoValue,
          ...(danger ? styles.dangerText : {}),
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: { marginBottom: 24 },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
    border: "1px solid #fee2e2",
  },
  header: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "#fee2e2",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#7f1d1d",
  },
  subtitle: {
    margin: 0,
    fontSize: 13,
    color: "#991b1b",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginBottom: 14,
  },
  infoRow: {
    background: "#fef2f2",
    borderRadius: 14,
    padding: "10px 12px",
    fontSize: 12,
  },
  infoLabel: {
    fontSize: 10,
    color: "#991b1b",
  },
  infoValue: {
    fontWeight: 600,
    color: "#7f1d1d",
  },
  dangerText: { color: "#b91c1c" },
  messageBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 13,
    color: "#9a3412",
    marginBottom: 16,
  },
  nextSteps: { marginBottom: 16 },
  nextTitle: {
    margin: "0 0 6px",
    fontSize: 14,
    fontWeight: 700,
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
  },
  actions: { display: "flex", gap: 10 },
  primaryBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 14,
    border: "none",
    background: "#7c2d12",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 14,
    border: "1px solid #fed7aa",
    background: "#fff",
    color: "#9a3412",
    fontWeight: 600,
    cursor: "pointer",
  },
};
