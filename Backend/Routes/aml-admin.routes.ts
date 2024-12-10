module.exports = (app) => {
  const accountant = require("../Controllers/aml-admin.controller");
  const express = require("express");
  const router = express.Router();

  router.use(express.json());

  router.get("/getReport", accountant.getReport);

  app.use("/admin", router);
};
