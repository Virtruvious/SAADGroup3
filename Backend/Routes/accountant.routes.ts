module.exports = (app) => {
  const accountant = require("../Controllers/accountant.controller");
  const express = require("express");
  const router = express.Router();

  router.use(express.json());

  router.get("/members", accountant.getAllMembers);
  router.get("/members/:memberId", accountant.getMemberInfo);
  router.get("/payments", accountant.payments);
  router.post("/payments/adjustments", accountant.createPaymentAdjustment);
  router.post("/payments/:paymentId/adjust", accountant.adjustPayment);
  router.get("/payments/history/:memberId", accountant.getPaymentHistory);
  router.get("/payments/history", accountant.getAllPaymentsHistory);
  router.get("/payments/analytics", accountant.getPaymentAnalytics);
  router.post("/createNotification", accountant.createNotification);
  router.get("/subscription-plans", accountant.getSubscriptionPlans);
  router.post("/members/:userId/membership", accountant.changeMembershipType);
  router.get("/payments/methods", accountant.getPaymentMethodSummary);
  router.get("/payments/extendedAnalytics", accountant.getExtendedAnalytics);
  router.get("/payments/outstanding", accountant.getOutstandingBalances);
  router.get("/reports/export", accountant.exportReport);

  app.use("/accountant", router);
};
