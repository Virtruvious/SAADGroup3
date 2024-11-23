module.exports = (app) => {
    const book = require('../Controllers/books.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.get('/newBooks', book.getNewBooks);
    router.get('/random', book.getRandomBooks);

    app.use('/books', router);
};