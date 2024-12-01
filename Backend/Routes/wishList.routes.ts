module.exports = (app) => {
    const wishList = require('../Controllers/wishList.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.post('/addMedia', wishList.addMedia);
    router.get('/getWishlist', wishList.getWishList);
    router.delete('/removeMedia', wishList.removeMedia);

    app.use('/wishlist', router);
}