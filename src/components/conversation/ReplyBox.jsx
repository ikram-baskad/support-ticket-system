// src/components/conversation/ReplyBox.jsx
import { useState } from "react";
import { Button, Switch } from "noplin-uis";
import { useUserContext } from "../../context/UserContext";
import styles from "./ReplyBox.module.css";

export function ReplyBox({ onSend, disabled }) {
  const { currentUser }      = useUserContext();
  const [body, setBody]      = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const isAgent = currentUser.role === "agent" || currentUser.role === "admin";

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed || disabled) return;

    onSend({
      authorId:   currentUser.id,
      authorRole: currentUser.role,
      body:       trimmed,
      isInternal: isAgent && isInternal,
    });

    setBody("");
    setIsInternal(false);
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`${styles.container} ${isInternal ? styles.internalMode : ""}`}>

      {/* Internal note toggle — only visible to agents */}
      {isAgent && (
        <div className={styles.toggleRow}>
          <Switch
            checked={isInternal}
            onChange={(val) => setIsInternal(val)}
          />
          <span className={styles.toggleHint}>
            {isInternal
              ? "🔒 Internal Note — agents only"
              : "💬 Reply to User"}
          </span>
        </div>
      )}

      <div className={styles.inputRow}>
        <textarea
          className={styles.textarea}
          placeholder={
            isInternal
              ? "Write an internal note for your team..."
              : "Write a reply... (Ctrl+Enter to send)"
          }
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          disabled={disabled}
        />

        <Button
          onClick={handleSend}
          disabled={!body.trim() || disabled}
          style={isInternal ? { background: "#f59e0b" } : {}}
        >
          {isInternal ? "Add Note" : "Send Reply"}
        </Button>
      </div>

      <p className={styles.hint}>
        Ctrl + Enter to send
      </p>

    </div>
  );
}