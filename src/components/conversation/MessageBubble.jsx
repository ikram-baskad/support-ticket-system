// src/components/conversation/MessageBubble.jsx
import { Avatar }      from "../common/Avatar";
import { formatDate }  from "../../utils/dateUtils";
import { getUserById } from "../../data/users.data";
import styles          from "./MessageBubble.module.css";

export function MessageBubble({ message, currentUserId }) {
  const author    = getUserById(message.authorId);
  const isOwn     = message.authorId === currentUserId;
  const isAgent   = message.authorRole === "agent" || message.authorRole === "admin";
  const isSystem  = message.authorRole === "system";

  if (isSystem) return <SystemMessage message={message} />;

  return (
    <div className={`
      ${styles.wrapper}
      ${isOwn    ? styles.ownWrapper    : styles.otherWrapper}
      ${isAgent  ? styles.agentWrapper  : ""}
    `}>

      {/* Avatar — shown on left for others, right for own */}
      {!isOwn && (
        <Avatar
          initials={author?.avatarInitials ?? "?"}
          size="sm"
          title={author?.name}
        />
      )}

      <div className={styles.bubbleGroup}>

        {/* Internal note banner */}
        {message.isInternal && (
          <div className={styles.internalBanner}>
            🔒 Internal Note — not visible to the user
          </div>
        )}

        <div className={`
          ${styles.bubble}
          ${isOwn             ? styles.ownBubble      : styles.otherBubble}
          ${message.isInternal ? styles.internalBubble : ""}
        `}>
          {message.body}
        </div>

        <div className={`
          ${styles.meta}
          ${isOwn ? styles.metaRight : styles.metaLeft}
        `}>
          <span className={styles.author}>
            {isOwn ? "You" : author?.name ?? "Unknown"}
          </span>
          {isAgent && !isOwn && (
            <span className={styles.agentTag}>Support Agent</span>
          )}
          <span className={styles.time}>
            {formatDate(message.createdAt)}
          </span>
        </div>

      </div>

      {/* Own avatar on the right */}
      {isOwn && (
        <Avatar
          initials={author?.avatarInitials ?? "?"}
          size="sm"
          title="You"
        />
      )}

    </div>
  );
}

function SystemMessage({ message }) {
  return (
    <div className={styles.systemMessage}>
      <span className={styles.systemDash} />
      <span className={styles.systemText}>{message.body}</span>
      <span className={styles.systemDash} />
    </div>
  );
}