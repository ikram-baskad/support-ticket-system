// src/pages/TicketDetail/TicketDetail.jsx
import { useState } from "react";
import { Button, GeneralSuccessNotification } from "noplin-uis";
import { useTickets }      from "../../hooks/useTickets";
import { useUserContext }  from "../../context/UserContext";
import { MessageBubble }  from "../../components/conversation/MessageBubble";
import { ReplyBox }       from "../../components/conversation/ReplyBox";
import { StatusBadge }    from "../../components/common/StatusBadge";
import { PriorityBadge }  from "../../components/common/PriorityBadge";
import { Avatar }         from "../../components/common/Avatar";
import { EmptyState }     from "../../components/common/EmptyState";
import { getUserById, getAgents } from "../../data/users.data";
import { formatDate }     from "../../utils/dateUtils";
import {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
} from "../../constants/ticket.constants";
import styles from "./TicketDetail.module.css";

export function TicketDetail({ ticketId, onNavigate }) {
  const [statusMsg, setStatusMsg] = useState("");
  const { getTicketById, getMessagesForTicket, updateTicket, addMessage } = useTickets();
  const { currentUser } = useUserContext();

  const ticket   = getTicketById(ticketId);
  const messages = getMessagesForTicket(ticketId);
  const isAgent  = currentUser.role === "agent" || currentUser.role === "admin";

  // Ticket not found guard
  if (!ticket) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => onNavigate("dashboard")}>
          ← Back to Dashboard
        </button>
        <EmptyState
          title="Ticket not found"
          description="This ticket may have been deleted or the ID is incorrect."
          action={
            <button onClick={() => onNavigate("dashboard")} className={styles.actionBtn}>
              Go to Dashboard
            </button>
          }
        />
      </div>
    );
  }

  const assignee = ticket.assignedTo ? getUserById(ticket.assignedTo) : null;
  const creator  = getUserById(ticket.createdBy);
  const agents   = getAgents();
  const isClosed = ticket.status === TICKET_STATUS.CLOSED ||
                   ticket.status === TICKET_STATUS.RESOLVED;

  const handleSendReply = (messageData) => {
    addMessage(ticket.id, messageData);
  };

  const handleStatusChange = (newStatus) => {
    updateTicket(ticket.id, { status: newStatus });
    setStatusMsg(`Status updated to ${newStatus.replace("_", " ")}`);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleAssign = (agentId) => {
    updateTicket(ticket.id, {
      assignedTo: agentId === "unassigned" ? null : agentId,
    });
  };

  const handlePriorityChange = (newPriority) => {
    updateTicket(ticket.id, { priority: newPriority });
  };

  // Visible messages depend on role
  const visibleMessages = isAgent
    ? messages
    : messages.filter((m) => !m.isInternal);

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => onNavigate("dashboard")}>
          ← Back to Dashboard
        </button>
        <span className={styles.ticketIdBadge}>{ticket.id}</span>
      </div>

      <div className={styles.layout}>

        {/* ── Main: conversation ───────────────────── */}
        <main className={styles.main}>

          {statusMsg && (
            <GeneralSuccessNotification message={statusMsg} />
          )}

          <div className={styles.mainHeader}>
            <h1 className={styles.title}>{ticket.title}</h1>
            <div className={styles.badges}>
              <StatusBadge   status={ticket.status}   />
              <PriorityBadge priority={ticket.priority} />
              <span className={styles.categoryTag}>{ticket.category}</span>
            </div>
          </div>

          {/* Conversation */}
          <div className={styles.conversation}>
            {visibleMessages.length === 0 ? (
              <EmptyState
                title="No messages yet"
                description="Be the first to reply to this ticket."
              />
            ) : (
              <div className={styles.messageList}>
                {visibleMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reply box */}
          {isClosed ? (
            <div className={styles.closedNotice}>
              🔒 This ticket is {ticket.status}. Reopen it to reply.
              {isAgent && (
                <Button onClick={() => handleStatusChange(TICKET_STATUS.OPEN)}>
                  Reopen Ticket
                </Button>
              )}
            </div>
          ) : (
            <ReplyBox onSend={handleSendReply} disabled={false} />
          )}

        </main>

        {/* ── Sidebar: ticket info + actions ───────── */}
        <aside className={styles.sidebar}>

          {/* Ticket metadata */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>Ticket Info</h3>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Created by</span>
              <div className={styles.metaValue}>
                <Avatar initials={creator?.avatarInitials ?? "?"} size="sm" />
                <span>{creator?.name ?? "Unknown"}</span>
              </div>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Created</span>
              <span className={styles.metaValue}>{formatDate(ticket.createdAt)}</span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Last updated</span>
              <span className={styles.metaValue}>{formatDate(ticket.updatedAt)}</span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Messages</span>
              <span className={styles.metaValue}>{ticket.messageCount}</span>
            </div>

            {ticket.tags.length > 0 && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Tags</span>
                <div className={styles.tags}>
                  {ticket.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Agent-only actions */}
          {isAgent && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Actions</h3>

              {/* Status */}
              <div className={styles.actionGroup}>
                <label className={styles.actionLabel}>Status</label>
                <select
                  className={styles.actionSelect}
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value={TICKET_STATUS.OPEN}>Open</option>
                  <option value={TICKET_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TICKET_STATUS.RESOLVED}>Resolved</option>
                  <option value={TICKET_STATUS.CLOSED}>Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div className={styles.actionGroup}>
                <label className={styles.actionLabel}>Priority</label>
                <select
                  className={styles.actionSelect}
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                >
                  <option value={TICKET_PRIORITY.LOW}>Low</option>
                  <option value={TICKET_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TICKET_PRIORITY.HIGH}>High</option>
                  <option value={TICKET_PRIORITY.CRITICAL}>Critical</option>
                </select>
              </div>

              {/* Assignee */}
              <div className={styles.actionGroup}>
                <label className={styles.actionLabel}>Assigned To</label>
                <select
                  className={styles.actionSelect}
                  value={ticket.assignedTo ?? "unassigned"}
                  onChange={(e) => handleAssign(e.target.value)}
                >
                  <option value="unassigned">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Assignee card */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>Assigned Agent</h3>
            {assignee ? (
              <div className={styles.assigneeDisplay}>
                <Avatar
                  initials={assignee.avatarInitials}
                  size="md"
                  title={assignee.name}
                />
                <div>
                  <p className={styles.assigneeName}>{assignee.name}</p>
                  <p className={styles.assigneeEmail}>{assignee.email}</p>
                </div>
              </div>
            ) : (
              <p className={styles.unassignedText}>
                No agent assigned yet.
              </p>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}