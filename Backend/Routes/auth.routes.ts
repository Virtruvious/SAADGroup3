module.exports = (app) => {
    const login = require('../Controllers/auth.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.post('/login', login.checkPassword);
    router.post('/staff/login', login.checkPasswordStaff);
    router.post('/register', login.registerUser);
    router.get('/notifications', login.getNotifications);
    router.post('/notifications/:notificationId/markRead', login.markNotificationRead);
    router.delete('/notifications/:notificationId', login.deleteNotification);

    app.use('/auth', router);
};