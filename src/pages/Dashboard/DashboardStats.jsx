// src/pages/Dashboard/DashboardStats.jsx
import styles from "./DashboardStats.module.css";

const STAT_CONFIG = [
  { key: "open",       label: "Open",        color: "#1a6fa8", bg: "#e8f4fd" },
  { key: "inProgress", label: "In Progress", color: "#a06000", bg: "#fff4e0" },
  { key: "resolved",   label: "Resolved",    color: "#1a7a45", bg: "#e6f9f0" },
  { key: "closed",     label: "Closed",      color: "#6b6b80", bg: "#f0f0f5" },
];

export function DashboardStats({ stats }) {
  return (
    <div className={styles.grid}>
      {STAT_CONFIG.map(({ key, label, color, bg }) => (
        <div key={key} className={styles.card} style={{ borderTop: `3px solid ${color}` }}>
          <p className={styles.count} style={{ color }}>{stats[key]}</p>
          <p className={styles.label}>{label}</p>
        </div>
      ))}
    </div>
  );
}