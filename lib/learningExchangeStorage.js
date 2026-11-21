// LocalStorage helpers for the personal "My Learning List".
//
// Two storages live side by side in this feature:
//   - Community recommendations → backend JSON via /api/recommendations
//   - Personal saved notes      → THIS file (browser LocalStorage)
//
// LocalStorage is the browser's built-in key/value store: it
// survives page refreshes AND closing/reopening the browser.
// It is per-browser (per device + profile) — nothing here is
// ever sent to the server or shown to other visitors.

const MY_LIST_KEY = "my-learning-list";

// The old, LocalStorage-only version of the page used this key.
// Those notes are migrated into the personal list (NOT published
// to the shared backend) the first time the new page loads.
const LEGACY_KEY = "learning-exchange-recommendations";

// Reads the personal list. Always returns an array — empty on
// first visit, read errors, or corrupted data.
export function loadMyList() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MY_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Writes the personal list back. Returns false if storage is
// unavailable (e.g. private mode limits), so the UI can warn.
export function saveMyList(list) {
  try {
    window.localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

// One-time migration: recommendations saved by the OLD version
// of this page (LocalStorage-only) become PERSONAL saved notes.
// They are NOT published to the shared backend — the community
// board starts empty and fills up only with new submissions.
// Returns the merged personal list (or null when there was
// nothing to migrate).
export function migrateLegacyRecommendations() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      return null;
    }

    const legacy = JSON.parse(raw);
    window.localStorage.removeItem(LEGACY_KEY);

    if (!Array.isArray(legacy) || legacy.length === 0) {
      return null;
    }

    const current = loadMyList();
    const knownIds = new Set(current.map((rec) => rec.id));
    const migrated = legacy.filter(
      (rec) => rec && rec.id && !knownIds.has(rec.id)
    );

    const merged = [...migrated, ...current];
    saveMyList(merged);
    return merged;
  } catch {
    return null;
  }
}

// Ownership tracking for the community board: this browser's
// own submissions (by id), so Edit/Delete can be offered only
// on notes submitted from here. Nothing secure — purely a
// client-side courtesy list.
const CONTRIBUTIONS_KEY = "my-contributions";

export function loadContributions() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CONTRIBUTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveContributions(ids) {
  try {
    window.localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}
