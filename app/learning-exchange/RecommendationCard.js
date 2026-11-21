// Reusable card showing one recommendation. Presentational
// only — the parent owns the list and the edit/delete actions.

import styles from "./page.module.css";

export default function RecommendationCard({
  recommendation: rec,
  onEdit,
  onDelete,
}) {
  const date = new Date(rec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className={`card ${styles.card}`}>
      <div className={styles.cardTop}>
        <span className={styles.categoryChip}>{rec.category}</span>
        <span className={styles.cardActions}>
          <button
            type="button"
            onClick={onEdit}
            className={styles.editIconButton}
            title="Edit"
            aria-label={`Edit “${rec.title}”`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteIconButton}
            title="Delete"
            aria-label={`Delete “${rec.title}”`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 L6 18 M6 6 L18 18" />
            </svg>
          </button>
        </span>
      </div>

      <h3 className={styles.cardTitle}>{rec.title}</h3>
      <p className={styles.cardMeta}>
        Recommended by <b>{rec.name}</b> · {date}
        {rec.updatedAt && " · edited"}
      </p>

      {rec.url && (
        <p>
          <a
            href={rec.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Visit resource ↗
          </a>
        </p>
      )}

      <p className={styles.cardDescription}>{rec.description}</p>
    </article>
  );
}
