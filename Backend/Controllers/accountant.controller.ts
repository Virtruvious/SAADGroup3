const accountant = require("../Models/accountant.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res) {
 if (!req.headers.authorization) {
   res.status(401).send("Unauthorized");
   return null;
 }

 const JWT = req.headers.authorization.split(" ")[1];
 let userId = null;
 
 if (!JWT) {
   res.status(401).send("Unauthorized");
   return null;
 }

 jwt.verify(JWT, process.env.TOKEN_SECRET, (err, decoded) => {
   if (err) {
     res.status(401).send("Unauthorized"); 
     return null;
   }
   userId = decoded.id;
 });
 
 return userId;
}

exports.getAllMembers = (req, res) => {
    accountant.getAllMembers((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Members" });
            console.log(err);
        } else {
            res.status(200).send({ members: data });
        }
    });
};

exports.payments = (req, res) => {
    accountant.payments((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payments" });
            console.log(err);
        } else {
            res.status(200).send({ payments: data });
        }
    });
};

exports.createPaymentAdjustment = async (req, res) => {
    const userId = await verifyJWT(req, res);
    if (!userId) return;
 
    const adjustmentData = {
        payment_id: req.body.payment_id,
        amount: req.body.amount,
        reason: req.body.reason,
        adjustedBy: userId
    };
 
    accountant.createPaymentAdjustment(adjustmentData, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error creating payment adjustment" });
            console.log(err);
        } else {
            res.status(200).send({
                message: "Payment adjustment created successfully",
                data: data
            });
        }
    });
 };
 
 exports.adjustPayment = async (req, res) => {
    const userId = await verifyJWT(req, res);
    if (!userId) return;
 
    const { paymentId } = req.params;
    const { adjustment, reason } = req.body;
 
    accountant.adjustPayment(paymentId, adjustment, userId, reason, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Adjusting Payment" });
        } else {
            res.status(200).send({ message: "Payment Adjusted Successfully" });
        }
    });
 };

exports.getPaymentHistory = (req, res) => {
    const { memberId } = req.params;
    accountant.getPaymentHistory(memberId, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payment History" });
            console.log(err);
        } else {
            res.status(200).send({ history: data });
        }
    });
};

exports.getAllPaymentsHistory = (req, res) => {
    accountant.getAllPaymentsHistory((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payments History" });
            console.log(err);
        } else {
            res.status(200).send({ history: data });
        }
    });
}

exports.getPaymentAnalytics = (req, res) => {
    accountant.getPaymentAnalytics((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Analytics" });
            console.log(err);
        } else {
            res.status(200).send({ analytics: data });
        }
    });
};

exports.getMemberInfo = (req, res) => {
    const { memberId } = req.params;
    accountant.getMemberInfo(memberId, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Member Info" });
            console.log(err);
        } else {
            res.status(200).send({ member: data });
        }
    });
};