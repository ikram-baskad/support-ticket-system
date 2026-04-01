// src/components/common/TagInput.jsx
import styles from "./TagInput.module.css";

export function TagInput({ tags, tagInput, onChange, onKeyDown, onRemove }) {
  return (
    <div className={styles.container}>
      {tags.map((tag) => (
        <span key={tag} className={styles.tag}>
          {tag}
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(tag)}
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      {tags.length < 5 && (
        <input
          className={styles.input}
          type="text"
          value={tagInput}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={tags.length === 0 ? "Type a tag, press Enter" : "Add another..."}
          maxLength={20}
        />
      )}
    </div>
  );
}