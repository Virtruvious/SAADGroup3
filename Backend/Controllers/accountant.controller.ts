import exp from "constants";

const accountant = require("../Models/accountant.model");

exports.getAllMembers = (req, res) => {
    accountant.getAllMembers((err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Members",
        });
        console.log(err);
        } else {
        const successfulRes = {
            members: data,
        };
        res.status(200).send(successfulRes);
        }
    });
    };

exports.payments = (req, res) => {
    accountant.payments((err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Payments",
        });
        console.log(err);
        } else {
        const successfulRes = {
            payments: data,
        };
        res.status(200).send(successfulRes);
        }
    });
}

exports.adjustPayment = (req, res) => {
    const paymentId = req.params.paymentId;
    const adjustment = req.body.adjustment;
    accountant.adjustPayment(paymentId, adjustment, (err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Adjusting Payment",
        });
        console.log(err);
        } else {
        const successfulRes = {
            message: "Payment Adjusted Successfully",
        };
        res.status(200).send(successfulRes);
        }
    });
}


exports.getMemberInfo = (req, res) => {
    const memberId = req.params.memberId;
    accountant.getMemberInfo(memberId, (err, data) => {
        if (err) {
        res.status(500).send({
            message: "Error Fetching Member Info",
        });
        console.log(err);
        } else {
        const successfulRes = {
            member: data,
        };
        res.status(200).send(successfulRes);
        }
    });
}