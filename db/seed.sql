-- Seed data for BookNotes app
-- Run only in development
CREATE DATABASE booknotes;

CREATE Table books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10),
    cover_url TEXT NOT NULL
);

INSERT INTO
    books (
        title,
        author,
        rating,
        cover_url
    )
VALUES (
        'Deep Work',
        'Cal Newport',
        8,
        'https://covers.openlibrary.org/b/id/8228691-L.jpg'
    ),
    (
        'The Alchemist',
        'Paulo Coelho',
        8,
        'https://covers.openlibrary.org/b/id/8231856-L.jpg'
    ),
    (
        'Rich Dad Poor Dad',
        'Robert Kiyosaki',
        7,
        'https://covers.openlibrary.org/b/id/8370226-L.jpg'
    ),
    (
        'Thinking, Fast and Slow',
        'Daniel Kahneman',
        9,
        'https://covers.openlibrary.org/b/id/8315043-L.jpg'
    ),
    (
        'Sapiens',
        'Yuval Noah Harari',
        9,
        'https://covers.openlibrary.org/b/id/8374147-L.jpg'
    ),
    (
        'The Power of Habit',
        'Charles Duhigg',
        8,
        'https://covers.openlibrary.org/b/id/8091016-L.jpg'
    ),
    (
        'Zero to One',
        'Peter Thiel',
        8,
        'https://covers.openlibrary.org/b/id/9090208-L.jpg'
    ),
    (
        'Clean Code',
        'Robert C. Martin',
        10,
        'https://covers.openlibrary.org/b/id/7984916-L.jpg'
    ),
    (
        'The Pragmatic Programmer',
        'Andrew Hunt',
        10,
        'https://covers.openlibrary.org/b/id/8281991-L.jpg'
    );
