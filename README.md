# 📚 BookNotes

> A full-stack personal reading library — search, rate, and curate the books that shaped you.

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-Template%20Engine-B4CA65?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ✨ Overview

**BookNotes** is a full-stack CRUD web application that lets you build a personal reading shelf. Search any book by title, and the app automatically fetches the cover art and author from the **Open Library API** — all you add is your rating. Your shelf can be sorted by top-rated, alphabetical, or most recently added.

The project is intentionally lean: no auth framework, no bloated ORM — just Express, PostgreSQL, and clean server-rendered EJS templates, demonstrating solid fundamentals in backend architecture and RESTful routing.

---

## 🖼️ Features

- 🔍 **Live book search** via the Open Library API — cover art and author fetched automatically
- ⭐ **1–10 personal rating system** with a visual progress bar per card
- 🗂️ **Sort your shelf** by rating, title (A–Z), or date added
- 🗑️ **Remove books** from your shelf with a single click
- 🚫 **Duplicate protection** — adding the same title twice is silently ignored
- 📱 **Fully responsive** — optimised for desktop, tablet, and mobile
- ♿ **Accessible markup** — semantic HTML, ARIA labels, screen-reader utilities
- 🎨 **Dark editorial UI** — Playfair Display + Inter, antique-gold accents, staggered card animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Web framework | Express 5 |
| Template engine | EJS |
| Database | PostgreSQL (via `pg` Pool) |
| External API | Open Library REST API |
| HTTP client | Axios |
| Environment | dotenv |
| Styling | Vanilla CSS (custom properties, CSS Grid) |

---

## 🗂️ Project Structure

```
booknotes/
├── public/
│   └── styles/
│       └── main.css          # All styling — design tokens, grid, cards
├── views/
│   └── index.ejs             # Single-page server-rendered template
├── db/
│   └── seed.sql              # Schema + seed data for local development
├── index.js                  # Express app entry point
├── .env.example              # Environment variable template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **PostgreSQL** 14 or later

### 1 — Clone the repository

```bash
git clone https://github.com/your-username/booknotes.git
cd booknotes
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set your database connection string:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/booknotes
```

### 4 — Set up the database

```bash
psql -U your_user -f db/seed.sql
```

This creates the `booknotes` database, the `books` table, and loads 9 seed books.

### 5 — Start the development server

```bash
npm run dev       # uses nodemon — restarts on file changes
# or
npm start         # plain node
```

Visit **http://localhost:3000** in your browser.

---

## 🌐 API Integration

BookNotes uses the public **Open Library Search API** — no API key required.

| Purpose | Endpoint |
|---|---|
| Search by title | `https://openlibrary.org/search.json?q={title}` |
| Fetch cover image | `https://covers.openlibrary.org/b/id/{cover_id}-L.jpg` |

On each `POST /add` request, the app queries Open Library, extracts the top result's title, primary author, and cover ID, then persists the record to PostgreSQL. If no cover or author is found, the request is silently rejected and the user is redirected back to the shelf.

---

## 🗃️ Database Schema

```sql
CREATE TABLE books (
    id        SERIAL PRIMARY KEY,
    title     TEXT    NOT NULL UNIQUE,
    author    TEXT    NOT NULL,
    rating    INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10),
    cover_url TEXT    NOT NULL
);
```

The `UNIQUE` constraint on `title` combined with `ON CONFLICT DO NOTHING` in the insert query provides lightweight duplicate protection at the database level.

---

## 📡 Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Render the shelf; optional `?sort=rating\|title` query param |
| `POST` | `/add` | Search Open Library, insert book if found |
| `POST` | `/delete/:id` | Remove a book by its database ID |

---

## 🔧 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://user:pass@localhost:5432/booknotes` |

For cloud deployments (Render, Railway, Supabase), the `ssl: { rejectUnauthorized: false }` option in the pool config handles managed database SSL certificates automatically.

---

## 📦 Deployment

The app is structured for straightforward deployment on any Node.js-compatible platform.

**Render (recommended)**
1. Push the repo to GitHub
2. Create a new **Web Service** on Render, connect the repo
3. Set build command: `npm install`, start command: `npm start`
4. Add the `DATABASE_URL` environment variable pointing to a Render PostgreSQL instance
5. Deploy

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mehedi Hossen Fahim**

- GitHub: [@your-username](https://github.com/MehdiHossenFahim)
- LinkedIn: [your-linkedin](https://linkedin.com/in/mehedihossenfahim)

---

<p align="center">Built with ☕ and a genuine love for books.</p>
