"use client";

// The Contact Requests inbox: a table of every message received
// through the Let's Get in Touch forms, with View / Edit / Delete
// actions. Data comes from GET /api/contacts; edits and deletes
// go through PUT and DELETE on /api/contacts/[id]. The visitor's
// original message is never editable here — only the status and
// private admin notes.

import { useEffect, useState } from "react";
import Modal from "../../learning-exchange/Modal";
import styles from "./adminContacts.module.css";

const STATUSES = ["New", "Reviewed", "Responded"];

function statusClass(status) {
  if (status === "Responded") return styles.statusResponded;
  if (status === "Reviewed") return styles.statusReviewed;
  return styles.statusNew;
}

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function previewOf(message) {
  const clean = (message || "").replace(/\s+/g, " ").trim();
  return clean.length > 90 ? `${clean.slice(0, 90)}…` : clean;
}

export default function ContactRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editStatus, setEditStatus] = useState("New");
  const [editNotes, setEditNotes] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [busyId, setBusyId] = useState(null);

  function done() {
    setViewing(null);
    setEditing(null);
    setDeleting(null);
    setBusyId(null);
  }

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contacts", { cache: "no-store" });
      const data = await response.json();
      setRequests(data.submissions || []);
    } catch {
      setError("Could not load contact requests. Is the dev server running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openEdit(request) {
    setEditing(request);
    setEditStatus(request.status || "New");
    setEditNotes(request.adminNotes || "");
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editing) return;
    setBusyId(editing.id);
    try {
      const response = await fetch(`/api/contacts/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, adminNotes: editNotes }),
      });
      if (response.ok) {
        const data = await response.json();
        setRequests((list) =>
          list.map((item) => (item.id === data.submission.id ? data.submission : item))
        );
        done();
      } else {
        setError("Could not save the changes. Please try again.");
      }
    } catch {
      setError("Could not save the changes. Please try again.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      const response = await fetch(`/api/contacts/${deleting.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRequests((list) => list.filter((item) => item.id !== deleting.id));
        done();
      } else {
        setError("Could not delete the request. Please try again.");
      }
    } catch {
      setError("Could not delete the request. Please try again.");
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Contact Requests</h1>
          <p className={styles.subtitle}>
            Manage messages received through Let&apos;s Get in Touch.
          </p>
        </div>
        <span className={styles.badge}>
          {loading ? "…" : `${requests.length} request${requests.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableCard}>
        {loading ? (
          <p className={styles.emptyState}>Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className={styles.emptyState}>
            No contact requests yet. Messages from your contact forms will appear here.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className={styles.name} data-label="Name">{request.name}</td>
                  <td className={styles.email} data-label="Email">{request.email}</td>
                  <td className={styles.preview} data-label="Message">
                    {previewOf(request.message)}
                  </td>
                  <td data-label="Status">
                    <span className={`${styles.status} ${statusClass(request.status)}`}>
                      {request.status || "New"}
                    </span>
                  </td>
                  <td className={styles.date} data-label="Date">
                    {formatDate(request.submittedAt)}
                  </td>
                  <td data-label="Actions">
                    <span className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        title="View"
                        aria-label={`View the message from ${request.name}`}
                        onClick={() => setViewing(request)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        title="Edit"
                        aria-label={`Edit the request from ${request.name}`}
                        onClick={() => openEdit(request)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        title="Delete"
                        aria-label={`Delete the request from ${request.name}`}
                        onClick={() => setDeleting(request)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 6h18M8 6V4h8v2m-9 0v14h10V6" />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewing && (
        <Modal title="View contact request" onClose={done}>
          <div className={styles.modalBody}>
            <h2 className={styles.modalTitle}>Message from {viewing.name}</h2>
            <p className={styles.modalMeta}>
              {viewing.email} · {formatDate(viewing.submittedAt)}
              {viewing.source ? ` · via ${viewing.source === "server-form" ? "server form" : "API form"}` : ""}
            </p>
            <blockquote className={styles.messageBody}>{viewing.message}</blockquote>
            <p className={styles.modalMeta}>
              Status:{" "}
              <span className={`${styles.status} ${statusClass(viewing.status)}`}>
                {viewing.status || "New"}
              </span>
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghostButton} onClick={done}>
                Close
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  const target = viewing;
                  setViewing(null);
                  openEdit(target);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal title="Edit contact request" onClose={done}>
          <form className={styles.modalBody} onSubmit={saveEdit}>
            <h2 className={styles.modalTitle}>Edit request — {editing.name}</h2>
            <p className={styles.modalMeta}>
              The visitor&apos;s original message is shown read-only and is never editable.
            </p>
            <blockquote className={`${styles.messageBody} ${styles.messageReadOnly}`}>
              {editing.message}
            </blockquote>
            <label className={styles.fieldLabel} htmlFor="contact-status">
              Status
            </label>
            <select
              id="contact-status"
              className={styles.fieldSelect}
              value={editStatus}
              onChange={(event) => setEditStatus(event.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <label className={styles.fieldLabel} htmlFor="contact-notes">
              Private admin notes
            </label>
            <textarea
              id="contact-notes"
              className={styles.fieldTextarea}
              value={editNotes}
              rows={4}
              placeholder="Your private notes about this request…"
              onChange={(event) => setEditNotes(event.target.value)}
            />
            <p className={styles.fieldHint}>
              Notes are for your eyes only — they are never shown to visitors.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghostButton} onClick={done}>
                Cancel
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={busyId === editing.id}
              >
                {busyId === editing.id ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete contact request" onClose={done}>
          <div className={styles.modalBody}>
            <h2 className={styles.modalTitle}>Delete this request?</h2>
            <p className={styles.modalMeta}>
              Message from <strong>{deleting.name}</strong> ({deleting.email}), received{" "}
              {formatDate(deleting.submittedAt)}.
            </p>
            <blockquote className={`${styles.messageBody} ${styles.messageReadOnly}`}>
              {deleting.message}
            </blockquote>
            <p className={styles.deleteWarning}>
              This permanently removes the message from the backend file. This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghostButton} onClick={done}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                disabled={busyId === deleting.id}
                onClick={confirmDelete}
              >
                {busyId === deleting.id ? "Deleting…" : "Delete Request"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
