const auth = require("../Models/auth.model");
const jwt = require("jsonwebtoken");

function generateAccessToken(param){
  return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '1800s'});
}

exports.checkPassword = (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    auth.checkPassword(username, password, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(401).send({
            message: "User not found",
          });
        } else if (err.kind === "invalid_password") {
          res.status(401).send({
            message: "Invalid password",
          });
        } else {
          res.status(500).send({
            message: "Error retrieving User with username " + username,
          });
        }
      } else {
        // Success, send user data and token
        const token = generateAccessToken({ id: data.id, username: data.username });
        const successfulRes = {
          user: {
            id: data.id,
            name: data.username,
          },
          token: token,
        };
        res.status(200).send(successfulRes);
      }
    });
  } else {
    res.status(400).send({
      message: "Username and password cannot be empty",
    });
  }
};

exports.registerUser = (req, res) => {
  const { firstName, lastName, email, postcode, houseNo, phone, role, password} = req.body;

  if (firstName && lastName && email && postcode && houseNo && phone && role && password) {
    auth.registerUser(firstName, lastName, email, postcode, houseNo, phone, role, password, (err, data) => {
      if (err) {
        if (err.kind === "duplicate") {
          res.status(409).send({
            message: "User ID Already Exists",
          });
        } else {
          res.status(500).send({
            message: "Error Creating User",
          });
          console.log(err);
        }
      } else {
        res.status(201).send({
          message: "User Created Successfully (id: " + data.insertId + ")",
        });
      }
    });
  } else {
    res.status(400).send({
      message: "All required fields must be filled.",
    });
  }
};