"use client";

import { useEffect, useRef, useState } from "react";

// One sticky note on the community board: a mini square paper
// card, pinned with a visible pushpin and a slight stable-random
// tilt. Clicking the paper opens the full recommendation. The
// top-right corner holds a small icon row: the bookmark (save
// to / remove from the personal "My Learning List") and — on
// notes submitted from this browser — a three-dot menu with
// Edit and Delete options.
//
// The tilt and paper color derive from the note's ID, so they
// look random but stay stable across re-renders.

import styles from "./page.module.css";

export default function StickyNote({
  recommendation: rec,
  variant,
  saved,
  onToggleSave,
  isMine,
  onEdit,
  onDelete,
  allowInlineEdit,
  onSaveLocalEdit,
  onClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Inline editing of the personal copy's text (My List only):
  // the draft lives here; saving reports up to the parent,
  // which writes it to LocalStorage — never to the API.
  const [editingText, setEditingText] = useState(false);
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  // Grow the textarea to fit its content so the paper never shows
  // empty space, and put the caret on the text right away.
  useEffect(() => {
    if (!editingText || !textareaRef.current) {
      return;
    }

    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [draft, editingText]);

  // Close the menu when clicking anywhere else on the page.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function close() {
      setMenuOpen(false);
    }

    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);
  const date = new Date(rec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.noteWrap}>
      <button
        type="button"
        onClick={onClick}
        style={{ "--tilt": `${variant.tilt}deg` }}
        className={`${styles.note} ${editingText ? styles.noteEditing : ""} ${styles[`noteTint${variant.tint}`]}`}
        aria-label={`Read the full recommendation “${rec.title}”`}
      >
        <span className={styles.noteCategory}>{rec.category}</span>
        <span className={styles.noteTitle}>{rec.title}</span>
        <span className={styles.noteMeta}>
          {rec.name} · {date}
        </span>
        {editingText ? (
          <span className={styles.inlineEdit} onClick={(event) => event.stopPropagation()}>
            <textarea
              ref={textareaRef}
              className={styles.inlineTextarea}
              value={draft}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              aria-label={`Edit the saved text of “${rec.title}”`}
            />
            <span className={styles.inlineButtons}>
              <button
                type="button"
                className={styles.inlineCancel}
                onClick={() => setEditingText(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.inlineSave}
                disabled={!draft.trim()}
                onClick={() => {
                  onSaveLocalEdit(rec, draft.trim());
                  setEditingText(false);
                }}
              >
                Save Changes
              </button>
            </span>
          </span>
        ) : (
          <span className={styles.notePreview}>{rec.description}</span>
        )}
      </button>

      <span className={styles.noteActions} onClick={(event) => event.stopPropagation()}>
          {allowInlineEdit && !editingText && (
            <button
              type="button"
              className={styles.editIconButton}
              title="Edit note text"
              aria-label={`Edit the saved text of “${rec.title}”`}
              onClick={() => {
                setDraft(rec.description);
                setEditingText(true);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}
        <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleSave();
        }}
        className={`${styles.bookmarkButton} ${saved ? styles.bookmarkSaved : ""}`}
        title={saved ? "Remove from My Learning List" : "Save to My Learning List"}
        aria-label={
          saved
            ? `Remove “${rec.title}” from My Learning List`
            : `Save “${rec.title}” to My Learning List`
        }
        aria-pressed={saved}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12v18l-6-4.5L6 21z" />
        </svg>
      </button>
        {isMine && (
        <span className={styles.noteMenuWrap}>
          <button
            type="button"
            className={styles.kebabButton}
            title="Note options"
            aria-label={`Options for “${rec.title}”`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="1.9" />
              <circle cx="12" cy="12" r="1.9" />
              <circle cx="12" cy="19" r="1.9" />
            </svg>
          </button>

          {menuOpen && (
            <span className={styles.noteMenu} role="menu" aria-label={`Options for “${rec.title}”`}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.menuDelete}
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>
            </span>
          )}
        </span>
      )}
      </span>


    </div>
  );
}
