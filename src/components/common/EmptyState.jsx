// src/components/common/EmptyState.jsx
import styles from "./EmptyState.module.css";

export function EmptyState({ title, description, action }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>🎫</div>
      <h3 className={styles.title}>{title}</h3>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {action && (
        <div className={styles.action}>{action}</div>
      )}
    </div>
  );
}