// src/pages/Dashboard/TicketTable.jsx
import { StatusBadge } from "../../components/common/StatusBadge";
import { PriorityBadge } from "../../components/common/PriorityBadge";
import { Avatar } from "../../components/common/Avatar";
import { getUserById } from "../../data/users.data";
import { timeAgo } from "../../utils/dateUtils";
import styles from "./TicketTable.module.css";

export function TicketTable({ tickets, onTicketClick }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Ticket</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Priority</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Assigned</th>
            <th className={styles.th}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TicketRow({ ticket, onClick }) {
  const assignee = ticket.assignedTo ? getUserById(ticket.assignedTo) : null;

  return (
    <tr className={styles.row} onClick={onClick} tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button" aria-label={`Open ticket ${ticket.id}`}
    >
      <td className={styles.td}>
        <span className={styles.ticketId}>{ticket.id}</span>
        <span className={styles.ticketTitle}>{ticket.title}</span>
      </td>
      <td className={styles.td}><StatusBadge status={ticket.status} /></td>
      <td className={styles.td}><PriorityBadge priority={ticket.priority} /></td>
      <td className={styles.td}>
        <span className={styles.category}>{ticket.category}</span>
      </td>
      <td className={styles.td}>
        {assignee ? (
          <Avatar
            initials={assignee.avatarInitials}
            size="sm"
            title={assignee.name}
          />
        ) : (
          <span className={styles.unassigned}>—</span>
        )}
      </td>
      <td className={styles.td}>
        <span className={styles.time}>{timeAgo(ticket.updatedAt)}</span>
      </td>
    </tr>
  );
}