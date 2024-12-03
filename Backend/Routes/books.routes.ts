module.exports = (app) => {
    const book = require('../Controllers/books.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.get('/newBooks', book.getNewBooks);
    router.get('/random', book.getRandomBooks);
    router.get('/:bookId', book.getBookInfo);
    router.post('/reserve/:bookId', book.reserveBook);
    router.post('/borrow/:bookId', book.borrowBook);
    router.post('/editReservation/:reservationId', book.editReservation); // Staff only
    router.post('/cancelReservation/:mediaId', book.cancelReservation);
    router.post('/editBorrow/:borrowId', book.editBorrow); // Staff only
    router.post('/cancelBorrow/:mediaId', book.cancelBorrow);
    router.get('/userSpecificInfo/:bookId', book.getUserSpecificInfo);

    app.use('/books', router);
};