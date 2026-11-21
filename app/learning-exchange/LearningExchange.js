"use client";

// The client-side brain of the Learning Exchange, phase 2:
//
//   - Community board  → loads from GET /api/recommendations,
//     new submissions go through POST (shared with everyone)
//   - My Learning List → the visitor's personal LocalStorage
//     list, toggled with the bookmark on any note; survives
//     refreshes and browser restarts
//
// Hydration note: both the fetch and the LocalStorage read run
// in effects after the first render — never during server
// rendering.

import { useEffect, useState } from "react";
import {
  loadMyList,
  saveMyList,
  loadContributions,
  saveContributions,
  migrateLegacyRecommendations,
} from "@/lib/learningExchangeStorage";
import StickyNote from "./StickyNote";
import RecommendationDetail from "./RecommendationDetail";
import RecommendationForm from "./RecommendationForm";
import Modal from "./Modal";
import styles from "./page.module.css";

// A tiny deterministic hash → the same input always gives the
// same number. Used to make the board look hand-placed without
// Math.random(), which prerendering forbids.
function stableHash(seed) {
  let hash = 0;
  for (const ch of seed) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  }
  return hash;
}

// Turns a note's id into a stable "random" look: a paper color
// (0–3) and a small tilt in degrees (-2 to 2). Same id → same
// look, every render.
function noteVariant(id) {
  const hash = stableHash(id);
  return { tint: hash % 4, tilt: (hash % 5) - 2 };
}

// The suggest note has no id yet — its tilt comes from a fixed
// seed instead, so it is stable and prerender-safe.
const SUGGEST_TILT = ((stableHash("suggest-a-resource") % 5) - 2) * 0.8;

// formState: null (board only) | { mode: "new" } |
// { mode: "edit", rec } — while open, the form lives in a modal.
export function LearningExchange() {
  const [recommendations, setRecommendations] = useState([]);
  const [myList, setMyList] = useState([]);
  const [view, setView] = useState("community"); // community | mine
  const [formState, setFormState] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Ids of recommendations submitted from this browser — they
  // are the only notes this visitor may edit or delete.
  const [contributions, setContributions] = useState([]);

  // One-time migration of old LocalStorage-only notes into the
  // personal list (they are NOT published to the backend), then
  // load both data sources: the shared board and my list.
  useEffect(() => {
    migrateLegacyRecommendations();
    setMyList(loadMyList());
    setContributions(loadContributions());

    async function loadBoard() {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        } else {
          setLoadError(true);
        }
      } catch {
        setLoadError(true);
      }
    }

    loadBoard();
  }, []);

  function toggleSaved(rec) {
    const alreadySaved = myList.some((item) => item.id === rec.id);
    const next = alreadySaved
      ? myList.filter((item) => item.id !== rec.id)
      : [rec, ...myList];

    setMyList(next);
    if (!saveMyList(next)) {
      setStorageWarning(true);
    }
    // Keep the open detail modal in sync with the new state.
    setViewing((prev) =>
      prev && prev.id === rec.id
        ? { ...prev, saved: !alreadySaved }
        : prev
    );
  }

  async function handleSubmit(data) {
    // The same form serves both modes: a new note (POST) and an
    // edited note (PUT /api/recommendations/[id]).
    const editing = formState?.mode === "edit" ? formState.rec : null;

    try {
      const response = await fetch(
        editing ? `/api/recommendations/${editing.id}` : "/api/recommendations",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (response.ok && result.success) {
        if (editing) {
          // Replace the note in place — the board updates at once.
          setRecommendations((prev) =>
            prev.map((rec) =>
              rec.id === editing.id ? result.recommendation : rec
            )
          );
        } else {
          // Show the new note immediately, then close the form.
          setRecommendations((prev) => [result.recommendation, ...prev]);

          // Remember this note as ours, so Edit/Delete appear on it.
          const next = [result.recommendation.id, ...contributions];
          setContributions(next);
          saveContributions(next);
        }
        setFormState(null);
        setView("community");
        return true;
      }

      return result; // { success: false, errors, message }
    } catch {
      return {
        success: false,
        errors: {},
        message: "Could not reach the server. Please try again.",
      };
    }
  }

  // Saves a personal copy's edited text to LocalStorage ONLY.
  // The community board's original note is never touched, and
  // no API request is made.
  function saveLocalEdit(rec, newDescription) {
    const next = myList.map((item) =>
      item.id === rec.id
        ? { ...item, description: newDescription, locallyEdited: true }
        : item
    );
    setMyList(next);
    saveMyList(next);
  }

  function handleEdit(rec) {
    setViewing(null);
    setFormState({ mode: "edit", rec });
  }

  async function handleDelete(rec) {
    if (
      !window.confirm(`Delete "${rec.title}"? This cannot be undone.`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/recommendations/${rec.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecommendations((prev) =>
          prev.filter((item) => item.id !== rec.id)
        );
        // Drop it from My Learning List too, if it was saved there.
        const nextList = myList.filter((item) => item.id !== rec.id);
        setMyList(nextList);
        saveMyList(nextList);
        setViewing(null);
      }
    } catch {
      // Network hiccup — leave the board as it is.
    }
  }

  const boardNotes = view === "community" ? recommendations : myList;

  return (
    <>
      {storageWarning && (
        <p role="alert" className={styles.storageWarning}>
          This browser is blocking saved data (common in private
          windows), so your personal list may not survive a refresh.
        </p>
      )}

      {loadError && (
        <p role="alert" className={styles.storageWarning}>
          The shared board could not be loaded. Please refresh the
          page to try again.
        </p>
      )}

      <div className={styles.pageWrap}>
      <div className={styles.board}>
          <div className={styles.boardHeader}>
            <button
              type="button"
              className={styles.suggestNote}
              style={{ "--tilt": `${SUGGEST_TILT}deg` }}
              onClick={() => setFormState({ mode: "new" })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14 M5 12h14" />
              </svg>
              Suggest a Resource
            </button>
            <h2 className={styles.boardTitle}>Learning Exchange</h2>

            <div className={styles.viewTabs} role="tablist" aria-label="Board views">
              <button
                type="button"
                role="tab"
                aria-selected={view === "community"}
                className={`${styles.viewTab} ${view === "community" ? styles.viewTabActive : ""}`}
                onClick={() => setView("community")}
              >
                Board
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "mine"}
                className={`${styles.viewTab} ${view === "mine" ? styles.viewTabActive : ""}`}
                onClick={() => setView("mine")}
              >
                My list ({myList.length})
              </button>
            </div>
          </div>

          <div
            className={styles.boardGrid}
            role="list"
            aria-label={
              view === "community"
                ? "Recommendations pinned to the board"
                : "My saved learning list"
            }
          >
            {boardNotes.map((rec) => (
              <StickyNote
                key={rec.id}
                recommendation={rec}
                variant={noteVariant(rec.id)}
                saved={myList.some((item) => item.id === rec.id)}
                onToggleSave={() => toggleSaved(rec)}
                allowInlineEdit={view === "mine"}
                onSaveLocalEdit={saveLocalEdit}
                isMine={contributions.includes(rec.id)}
                onEdit={() => handleEdit(rec)}
                onDelete={() => handleDelete(rec)}
                onClick={() =>
                  setViewing({
                    ...rec,
                    saved: myList.some((item) => item.id === rec.id),
                  })
                }
              />
            ))}
          </div>

          {view === "community" && recommendations.length === 0 && (
            <p className={styles.emptyState}>
              Nothing pinned yet — be the first to suggest a resource!
            </p>
          )}

          {view === "mine" && myList.length === 0 && (
            <p className={styles.emptyState}>
              Your list is empty — open any note and save it here with
              the bookmark button.
            </p>
          )}
      </div>
      </div>

      {viewing && (
        <RecommendationDetail
          key={viewing.id}
          recommendation={viewing}
          onClose={() => setViewing(null)}
          onToggleSave={() => toggleSaved(viewing)}
          isMine={contributions.includes(viewing.id)}
          onEdit={() => handleEdit(viewing)}
          onDelete={() => handleDelete(viewing)}
        />
      )}

      {formState && (
        <Modal
          title={
            formState.mode === "edit"
              ? "Edit recommendation"
              : "Suggest a resource"
          }
          onClose={() => setFormState(null)}
        >
          <h2 className={styles.modalHeading}>
            {formState.mode === "edit"
              ? "Edit your recommendation"
              : "Share a recommendation"}
          </h2>
          <RecommendationForm
            key={formState.mode === "edit" ? formState.rec.id : "new"}
            submitWith={handleSubmit}
            initialValues={
              formState.mode === "edit" ? formState.rec : undefined
            }
            submitLabel={formState.mode === "edit" ? "Save changes" : undefined}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}
    </>
  );
}
