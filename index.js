import express from "express";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =========================
// DATABASE SETUP
// =========================
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech') 
        ? { rejectUnauthorized: false }
        : false,
});

// =========================
// MIDDLEWARE
// =========================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =========================
// API CONSTANTS
// =========================
const api_url = "https://openlibrary.org/search.json?q=";
const cover_url = "https://covers.openlibrary.org/b/id/";

// =========================
// HOME + SORTING
// =========================
app.get("/", async (req, res) => {
    try {
        let sort = req.query.sort;

        let query = "SELECT * FROM books";

        if (sort === "rating") {
            query += " ORDER BY rating DESC";
        } else if (sort === "title") {
            query += " ORDER BY title ASC";
        } else {
            query += " ORDER BY id DESC";
        }

        const result = await db.query(query);
        const books = result.rows;

        res.render("index.ejs", { books });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Something went wrong: " + err.message);
    }
});

// =========================
// ADD BOOK
// =========================
app.post("/add", async (req, res) => {
    try {
        const titleInput = req.body.searchBook;
        const rating = parseInt(req.body.rating);

        const response = await axios.get(api_url + titleInput.replace(/ /g, "+"));
        const data = response.data.docs[0];

        if (!data || !data.cover_i || !data.title || !data.author_name) {
            return res.redirect("/");
        }

        const title = data.title;
        const author = data.author_name[0];
        const cover = cover_url + data.cover_i + "-L.jpg";

        await db.query(
            "INSERT INTO books (title, author, rating, cover_url) VALUES ($1, $2, $3, $4) ON CONFLICT (title) DO NOTHING",
            [title, author, rating, cover]
        );

        res.redirect("/");
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

// =========================
// DELETE BOOK
// =========================
app.post("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Something went wrong: " + err.message);
    }
});

export default app;
