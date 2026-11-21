"use client";

// Generic modal shell: dark backdrop, closable via the X button,
// the Escape key, or clicking the backdrop. Locks page scroll
// while open. The content (form, detail view…) is passed in.

import { useEffect } from "react";
import styles from "./page.module.css";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      data-testid="modal-backdrop"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.modalPanel}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={styles.modalClose}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 L6 18 M6 6 L18 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
