const purchaseMan = require("../models/purchaseMan.model");

exports.getVendors = (req, res) => {
    purchaseMan.getVendors((err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Vendors",
        });
        console.log(err);
        } else {
        const successfulRes = {
            vendors: data,
        };
        res.status(200).send(successfulRes);
        }
    });
    };

exports.getBranches = (req, res) => {
    purchaseMan.getBranches((err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Branches",
        });
        console.log(err);
        } else {
        const successfulRes = {
            branches: data,
        };
        res.status(200).send(successfulRes);
        }
    });
};

exports.createPurchaseOrder = (req, res) => {
    const purchaseData = {
        vendor_id: req.body.vendor_id,
        user_id: req.body.user_id,
    };

    purchaseMan.createPurchaseOrder(purchaseData, (err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Creating Purchase Order",
        });
        console.log(err);
        } else {
        const successfulRes = {
            order: data,
        };
        res.status(200).send(successfulRes, "Purchase Order Created");
        }
    });
};


exports.getTrackingOrders = (req, res) => {
    purchaseMan.getTrackingOrders((err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Tracking Orders",
        });
        console.log(err);
        } else {
        const successfulRes = {
            tracking: data,
        };
        res.status(200).send(successfulRes);
        }
    });
};

exports.getVendorMedia = (req, res) => {
    const vendorId = req.params.vendorId;
    purchaseMan.getVendorMedia(vendorId, (err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Vendor Media",
        });
        console.log(err);
        } else {
        const successfulRes = {
            media: data,
        };
        res.status(200).send(successfulRes);
        }
    });
};

exports.createMedia = (req, res) => {
    const mediaData = {
        title: req.body.title,
        author: req.body.author,
        media_type: req.body.media_type,
        publication_year: req.body.publication_year,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        vendor_id: req.body.vendor_id,
    };

    purchaseMan.createMedia(mediaData, (err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Creating Media",
        });
        console.log(err);
        } else {
        const successfulRes = {
            media: data,
        };
        res.status(200).send(successfulRes, "Media Created");
        }
    });
};

exports.createPurchaseOrder = (req, res) => {
    const purchaseData = {
        vendor_id: req.body.vendor_id,
        user_id: req.body.user_id,
        items: req.body.items, 
        branch_id: req.body.branch_id,
        delivery_date: req.body.delivery_date
    };

    purchaseMan.createPurchaseOrder(purchaseData, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error Creating Purchase Order",
            });
            console.log(err);
        } else {
            const successfulRes = {
                order: data,
            };
            res.status(200).send(successfulRes);
        }
    });
};

exports.getOrderDetails = (req, res) => {
    const orderId = req.params.orderId;
    purchaseMan.getOrderDetails(orderId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error Fetching Order Details",
            });
            console.log(err);
        } else {
            const successfulRes = {
                orderDetails: data,
            };
            res.status(200).send(successfulRes);
        }
    });
};

exports.updateOrderStatus = (req, res) => {
    const { order_id, status } = req.body;
    purchaseMan.updateOrderStatus(order_id, status, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error Updating Order Status",
            });
            console.log(err);
        } else {
            const successfulRes = {
                message: "Status Updated Successfully",
                data: data,
            };
            res.status(200).send(successfulRes);
        }
    });
};

exports.getTrackingOrders = (req, res) => {
    purchaseMan.getTrackingOrders((err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error Fetching Tracking Orders",
            });
            console.log(err);
        } else {
            const successfulRes = {
                tracking: data,
            };
            res.status(200).send(successfulRes);
        }
    });
};