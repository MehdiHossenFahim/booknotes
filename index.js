import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// OpenLibrary API
const api_url = "https://openlibrary.org/search.json?q=";
const cover_url = "https://covers.openlibrary.org/b/id/";
const cover_size = "-M.jpg";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// store books in memory (simple version for assignment)
let books = [];

app.get("/", async (req, res) => {
    res.render("index.ejs", { books });
});

app.post("/add", async (req, res) => {
    try {
        const query = req.body.searchBook;

        const response = await axios.get(api_url + query.replace(/ /g, "+"));
        const data = response.data.docs[0];

        if (!data) return res.redirect("/");

        const book = {
            title: data.title || "No title",
            author: data.author_name ? data.author_name[0] : "Unknown author",
            cover: data.cover_i
                ? cover_url + data.cover_i + cover_size
                : "https://via.placeholder.com/150x220?text=No+Cover"
        };

        books.push(book);

        res.redirect("/");
    } catch (error) {
        console.log(error.message);
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});