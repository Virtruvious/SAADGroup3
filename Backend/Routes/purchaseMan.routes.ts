module.exports = (app) => {
    const purchaseMan = require('../Controllers/purchaseMan.controller');
    const express = require('express');
    const router = express.Router();

    router.use(express.json());

    router.get('/vendors', purchaseMan.getVendors);
    router.post('/purchaseOrder', purchaseMan.createPurchaseOrder);
    router.get('/trackingOrders', purchaseMan.getTrackingOrders);
    router.get('/vendorMedia/:vendorId', purchaseMan.getVendorMedia);
    router.get('/branches', purchaseMan.getBranches);
    router.post('/createMedia', purchaseMan.createMedia);
    router.get('/orderDetails/:orderId', purchaseMan.getOrderDetails);
    router.post('/updateOrderStatus', purchaseMan.updateOrderStatus);

    app.use('/purchaseMan', router); 
};