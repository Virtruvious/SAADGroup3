const accountant = require("../Models/aml-admin.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res) {
  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const JWT = req.headers.authorization.split(" ")[1];
  let user_id = null;
  if (!JWT) {
    res.status(401).send("Unauthorized");
    return null;
  } else {
    jwt.verify(JWT, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized");
        return null;
      } else {
        if (decoded.role !== "staff" && !decoded.email.includes("AM")) {
          res.status(403).send("Forbidden");
          return null;
        }
        user_id = decoded.id;
      }
    });
    return user_id;
  }
}

exports.getReport = async (req, res) => {
  const { timeFrame } = req.query;

  const staffId = await verifyJWT(req, res);
  if (!staffId) return;

  accountant.getReport(timeFrame, (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error fetching system report" });
      console.log(err);
    } else {
      res.status(200).send(data);
    }
  });
};
