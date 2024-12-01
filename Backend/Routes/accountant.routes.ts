module.exports = (app) => {
    const accountant = require('../Controllers/accountant.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.get('/members', accountant.getAllMembers);
    router.get('/payments', accountant.payments);
    router.post('/payments/:paymentId/adjust', accountant.adjustPayment);
    router.get('/members/:memberId', accountant.getMemberInfo);

    app.use('/accountant', router);
};