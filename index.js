import express from "express";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// =========================
// DATABASE SETUP
// =========================
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

// =========================
// MIDDLEWARE
// =========================
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

        // sorting logic
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
    }
});

// =========================
// ADD BOOK
// =========================
app.post("/add", async (req, res) => {
    try {
        const titleInput = req.body.searchBook;
        const rating = parseInt(req.body.rating);

        // API call
        const response = await axios.get(api_url + titleInput.replace(/ /g, "+"));
        const data = response.data.docs[0];

        if (!data || !data.cover_i || !data.title || !data.author_name) {
            return res.redirect("/");
        }

        const title = data.title;
        const author = data.author_name[0];
        const cover = cover_url + data.cover_i + "-L.jpg"; // FULL SIZE COVER

        // insert with duplicate protection
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
    }
});

// =========================
// START SERVER
// =========================
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

