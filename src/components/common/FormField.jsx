// src/components/common/FormField.jsx
import styles from "./FormField.module.css";

export function FormField({ label, required, error, hint, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}