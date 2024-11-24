const auth = require("../Models/auth.model");
const jwt = require("jsonwebtoken");

function generateAccessToken(param){
  return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '1800s'});
}

exports.checkPassword = (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    auth.checkPassword(email, password, (err, data) => {
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
            message: "Error retrieving User with email " + email,
          });
        }
      } else {
        // Success, send user data and token
        const token = generateAccessToken({ id: data.user_id, email: data.email, role: data.role });
        const successfulRes = {
          user: {
            id: data.user_id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            subscription: {
              type: data.subscription_type,
              start_date: data.start_date,
              end_date: data.end_date,
            }
          },
          token: token,
        };
        console.log("Logged in user: ", successfulRes.user);
        res.status(200).send(successfulRes);
      }
    });
  } else {
    res.status(400).send({
      message: "Email and password cannot be empty",
    });
  }
};

exports.registerUser = (req, res) => {
  const { firstName, lastName, email, postcode, houseNo, phone, role, password, subscriptionType} = req.body;

  if (firstName && lastName && email && postcode && houseNo && phone && role && password && subscriptionType) {
    auth.registerUser(firstName, lastName, email, postcode, houseNo, phone, role, password, subscriptionType, (err, data) => {
      if (err) {
        if (err.kind === "duplicate") {
          res.status(409).send({
            message: "Email Already Exists",
          });
        } else {
          res.status(500).send({
            message: "Error Creating User",
          });
          console.log(err);
        }
      } else {
        console.log("Registering user data: ", req.body);
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