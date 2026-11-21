# Midterm Expanded Portfolio

## Overview

This is the midterm expansion of my personal portfolio website, built on top of the first two parts. The existing pages and features are carried over unchanged — this milestone adds three new capabilities on top of them:

- **Learning Exchange** (`/learning-exchange`) — a community corkboard where visitors suggest learning materials, plus a personal **My Learning List** saved in the browser
- **Admin Contact Requests** (`/admin/contacts`) — an inbox-style page to read, organize, and manage the messages received through both contact forms
- **Projects via API** (`/projects`, `/admin/projects`) — project data moved from a hardcoded JavaScript file into a backend JSON file with a full CRUD API and a new admin page

The earlier parts live in separate repositories: [Portfolio-Website-Part-1-](https://github.com/sevgicosan/Portfolio-Website-Part-1-) and [Portfolio-Website-Part-2](https://github.com/sevgicosan/Portfolio-Website-Part-2). Everything built there (the pages, the dynamic project routes, both contact forms, and the blog with its admin page) is carried over unchanged.

Like the previous parts, the website was developed using the Viber Coding Agent as part of an AI-assisted software development course. Throughout the development process, I used the agent to generate code, review its implementation, test functionality, and make improvements.

## Installation and Running

Step 1 — Clone the repository and open the project folder:

```bash
git clone https://github.com/sevgicosan/Portfolio-Website-Part-2.git
cd Portfolio-Website-Part-2
```

Step 2 — Install the dependencies (Node.js 18.18+ required):

```bash
npm install
```

Step 3 — Start the development server:

```bash
npm run dev
```

Step 4 — Open the site in your browser at:

```
http://localhost:3000
```

To check code quality and produce a production build:

```bash
npm run lint
npm run build
```

## Technologies Used

- **Next.js 16** (App Router) — page routing, server actions, route handlers, static/dynamic rendering
- **React 19** — component-based UI
- **JavaScript (ES Modules)** — no TypeScript
- **CSS Modules + global stylesheet** — component-scoped styles and design tokens (no UI frameworks)
- **Server Actions** — server-side form handling without a separate API
- **Route Handlers (API routes)** — REST-style endpoints (`/api/contacts`, `/api/blogs`, `/api/recommendations`, `/api/projects`) with GET/POST/PUT/DELETE support
- **FormData & multipart uploads** — blog cover images sent from the browser and stored on the server
- **Cache Components (`"use cache"`)** — cached blog and project pages that still pick up edits (with `cacheLife`)
- **Node.js `fs` API** — contact submissions, blog posts, recommendations, and projects stored in local JSON files; images in `public/uploads`
- **LocalStorage** — the personal side of the Learning Exchange (bookmarks, saved-copy edits, and contributions) lives entirely in the visitor's browser
- **Inline SVG** — all icons and decorative graphics (no icon libraries)
- **Google Fonts via `next/font`** — Carlito for body text (Georgia is a system font)

## Website Pages & Features

The pages from the first two parts are unchanged — see [Part 1](https://github.com/sevgicosan/Portfolio-Website-Part-1-) and [Part 2](https://github.com/sevgicosan/Portfolio-Website-Part-2) for their details: Homepage, About Me, Work Experience, Projects, both **Contact** forms, the **Blog** with its admin page, and the custom 404 page.

The navigation bar now includes one new link: **Learning Exchange**.

**`/learning-exchange` — Learning Exchange (community corkboard)**
A community board styled as a corkboard — a linen surface where every recommendation is a sticky note with a pushpin and a slight tilt:

- Visitors suggest a learning material (contributor name, title, category, optional link, description) through a modal form. The note is saved with a **POST** request to `/api/recommendations` and appended to `data/recommendations.json` — server-side validation rejects empty or too-short fields
- The board reads the notes with a **GET** request and renders them as a responsive grid of square notes. Each note gets a paper tint and a tilt derived from a **stable hash of its id** (never `Math.random()`, which would break the prerendered build)
- Clicking a note opens the full recommendation in a modal
- **My Learning List**: the bookmark on any note saves a personal copy into the browser's LocalStorage (`my-learning-list`). The "My list" tab shows the saved notes with their bookmark counts. No account needed — the list lives in the visitor's browser
- **Inline editing of saved cards**: on the My List tab, a pencil turns the recommendation text into an editable area that looks like writing directly on the paper — transparent background, a dashed ruling, the same typography, and an auto-growing field. **Save Changes** updates the personal copy in LocalStorage only; the community board's original note is never touched and no API request is sent. Cancel discards the draft
- **Managing own notes**: notes submitted from the current browser show a three-dot menu with **Edit** (loads the note into the same form, saves through `PUT /api/recommendations/[id]`) and **Delete** (through `DELETE /api/recommendations/[id]`). The browser remembers its own submissions in LocalStorage (`my-contributions`)

### Learning Exchange: Community Board + Personal List

The board is shared data in a JSON file; the personal list is browser-local — two layers, one page:

- Community: `POST`/`GET`/`PUT`/`DELETE` on `/api/recommendations` ↔ `data/recommendations.json`
- Personal: bookmarks, inline edits, and contributions in LocalStorage — merged at render time, never sent back to the server

**`/admin/contacts` — Admin Contact Requests (inbox)**
An inbox-style dashboard for the messages received through **both** contact forms (server form and API form — they share `data/submissions.json`, no second file was created):

- A table lists every request with the visitor's **name, email, a message preview, a status chip (New / Reviewed / Responded), the submission date, and View / Edit / Delete actions**, plus a badge with the total count. On small screens each row stacks into a labeled line so the table stays readable
- **View** opens the complete message in a modal; **Edit** lets me change the status and add **private admin notes** — the visitor's original message is shown read-only and is never editable; **Delete** asks for a confirmation before removing the request
- Updates go through `PUT /api/contacts/[id]` and deletions through `DELETE /api/contacts/[id]`; the list is read with `GET /api/contacts`. All changes persist in `data/submissions.json` and survive a refresh. The existing contact forms and their `POST /api/contacts` endpoint are untouched

**Projects — API + backend JSON (migration)**
Project data used to be hardcoded as a static JavaScript list (`lib/projects.js`). It now lives in `data/projects.json`, migrated verbatim — every title, description, overview paragraph, key feature, technology, and every **slug** was preserved, so all existing project URLs (`/projects/h1b-program-fairness-analysis`, …) still work:

- **`GET /api/projects`** returns the list (the public pages read through it); **`POST /api/projects`**, **`PUT /api/projects/[id]`**, and **`DELETE /api/projects/[id]`** provide the full CRUD
- **`/projects`** fetches the list live from the API (the same pattern as the blog list), so admin changes appear immediately
- **`/projects/[slug]`** renders each detail page from the same JSON through a cached read (`"use cache"` with `cacheLife("minutes")`), so edits become visible on the public page shortly after saving. Unknown slugs still fall through to the **custom 404 page**

**`/admin/projects` — Admin Projects (full CRUD)**
Follows the structure and design of the Admin Blog page:

- **Create**: a form with the project's title, short description, GitHub URL, technologies (comma-separated), overview (one paragraph per line), and key features (one per line). The server validates the input and a unique **slug** is generated from the title — it becomes the project's permanent web address and never changes afterwards
- **Read**: the existing projects are listed below the form with their technologies, reusing the same row component as the public pages
- **Update**: **Edit** loads a project back into the same form, prefilled, and saves through `PUT /api/projects/[id]` — the URL keeps working
- **Delete**: the trash button shows a **confirmation dialog** naming the project before removing it through `DELETE /api/projects/[id]`
- Clear **success and error messages**: server-side validation errors appear under the matching fields, and a confirmation banner links to the saved project's page
