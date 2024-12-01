module.exports = (app) => {
    const login = require('../Controllers/auth.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.post('/login', login.checkPassword);
    router.post('/staff/login', login.checkPasswordStaff);
    router.post('/register', login.registerUser);

    app.use('/auth', router);
};