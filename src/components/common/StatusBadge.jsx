// src/components/common/StatusBadge.jsx
import { TICKET_STATUS } from "../../constants/ticket.constants";
import styles from "./StatusBadge.module.css";

const STATUS_CONFIG = {
  [TICKET_STATUS.OPEN]:        { label: "Open",        className: styles.open        },
  [TICKET_STATUS.IN_PROGRESS]: { label: "In Progress", className: styles.inProgress  },
  [TICKET_STATUS.RESOLVED]:    { label: "Resolved",    className: styles.resolved    },
  [TICKET_STATUS.CLOSED]:      { label: "Closed",      className: styles.closed      },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];

  // Defensive: unknown status doesn't crash the app
  if (!config) return <span className={styles.badge}>Unknown</span>;

  return (
    <span className={`${styles.badge} ${config.className}`}>
      {config.label}
    </span>
  );
}