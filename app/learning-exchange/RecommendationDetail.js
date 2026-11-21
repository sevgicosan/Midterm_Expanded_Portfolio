"use client";

// Full recommendation view inside a modal. No editing here —
// community notes belong to everyone. Instead: the bookmark
// toggle, which saves the note to (or removes it from) the
// visitor's personal "My Learning List" in LocalStorage.

import Modal from "./Modal";
import styles from "./page.module.css";

export default function RecommendationDetail({
  recommendation: rec,
  onClose,
  onToggleSave,
}) {
  const date = new Date(rec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal title={`Recommendation: ${rec.title}`} onClose={onClose}>
      <span className={styles.categoryChip}>{rec.category}</span>
      <h2 className={styles.detailTitle}>{rec.title}</h2>
      <p className={styles.cardMeta}>
        Recommended by <b>{rec.name}</b> · {date}
      </p>

      {rec.url && (
        <p>
          <a
            href={rec.url}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary"
          >
            Visit resource ↗
          </a>
        </p>
      )}

      <p className={styles.detailDescription}>{rec.description}</p>

      <div className={styles.detailActions}>
        <button
          type="button"
          onClick={onToggleSave}
          className={
            rec.saved ? "button button-secondary" : "button button-primary"
          }
        >
          {rec.saved ? "✓ Saved to My Learning List" : "Save to My Learning List"}
        </button>
        <span className={styles.detailHint}>
          {rec.saved
            ? "Click again to remove it from your list."
            : "Kept in this browser — visible only to you."}
        </span>
      </div>
    </Modal>
  );
}
