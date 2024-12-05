module.exports = (app) => {
    const accountant = require('../Controllers/accountant.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.get('/members', accountant.getAllMembers);
    router.get('/members/:memberId', accountant.getMemberInfo);
    router.get('/payments', accountant.payments);
    router.post('/payments/adjustments', accountant.createPaymentAdjustment);
    router.post('/payments/:paymentId/adjust', accountant.adjustPayment);
    router.get('/payments/history/:memberId', accountant.getPaymentHistory);
    router.get('/payments/history', accountant.getAllPaymentsHistory);
    router.get('/payments/analytics', accountant.getPaymentAnalytics);

    app.use('/accountant', router);
};