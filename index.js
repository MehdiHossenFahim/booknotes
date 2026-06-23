import express from 'express';
import axios from 'axios';


const port = 3000;
const api_url = "https://openlibrary.org/search.json?q=";
const cover_url = "https://covers.openlibrary.org/b/id/";
const cover_url_end = "-M.jpg";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let bookName = "Atomic Habits";

app.get('/', async (req, res) => {
    const response = await axios.get(api_url + bookName);
    const result = response.data.docs[0];
    const bookTitle = result.title;
    const author_name = result.author_name[0];
    const bookCover = cover_url + result.cover_i + cover_url_end;
    // console.log(bookCover);
    // console.log(result.title);
    // console.log(result.author_name[0]);
    res.render("index.ejs", { title: bookTitle, author: author_name, cover: bookCover });
})

app.post('/add', async (req, res) => {
    const result = req.body.searchBook;
    bookName = result.replace(" ", "+").toLowerCase().trimEnd();
    // console.log(book_query, book_query.length);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})