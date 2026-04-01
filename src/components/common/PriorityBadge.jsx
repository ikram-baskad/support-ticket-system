// src/components/common/PriorityBadge.jsx
import { TICKET_PRIORITY } from "../../constants/ticket.constants";
import styles from "./PriorityBadge.module.css";

const PRIORITY_CONFIG = {
  [TICKET_PRIORITY.LOW]:      { label: "Low",      className: styles.low      },
  [TICKET_PRIORITY.MEDIUM]:   { label: "Medium",   className: styles.medium   },
  [TICKET_PRIORITY.HIGH]:     { label: "High",     className: styles.high     },
  [TICKET_PRIORITY.CRITICAL]: { label: "Critical", className: styles.critical },
};

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  return (
    <span className={`${styles.badge} ${config.className}`}>
      {config.label}
    </span>
  );
}