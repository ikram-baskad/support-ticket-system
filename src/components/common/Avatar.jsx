// src/components/common/Avatar.jsx
import styles from "./Avatar.module.css";

const COLORS = [
  "#4F6EF7", "#E8513A", "#2CA86E",
  "#9B59B6", "#E67E22", "#1ABC9C",
];

// Deterministic color from initials — same initials always same color
function colorFromInitials(initials = "") {
  const index = initials.charCodeAt(0) % COLORS.length;
  return COLORS[index];
}

export function Avatar({ initials = "?", size = "md", title }) {
  const bg = colorFromInitials(initials);

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{ backgroundColor: bg }}
      title={title || initials}
      aria-label={title || initials}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}