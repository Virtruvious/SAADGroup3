const auth = require("../Models/auth.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res) {
  try {
    console.log("Headers:", req.headers); 
    
    if (!req.headers.authorization) {
      console.log("No authorization header");
      res.status(401).json({ message: "No authorization header" });
      return null;
    }

    const JWT = req.headers.authorization.split(" ")[1];
    console.log("Extracted JWT:", JWT); 
    
    if (!JWT) {
      console.log("No token after split");
      res.status(401).json({ message: "No token provided" });
      return null;
    }

    console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);
    
    const decoded = jwt.verify(JWT, process.env.TOKEN_SECRET);
    console.log("Decoded token:", decoded); 
    return decoded.id;
  } catch (err) {
    console.error("JWT Verification error:", err);
    res.status(401).json({ message: "Invalid token", error: err.message });
    return null;
  }
}

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
              price: data.price,
              duration: data.duration,
              billing_frequency: data.billing_frequency
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

exports.checkPasswordStaff = (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    auth.checkPasswordStaff(email, password, (err, data) => {
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
            message: "Error retrieving Staff with email " + email,
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
              price: data.price,
              duration: data.duration,
              billing_frequency: data.billing_frequency
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
  const { 
    firstName, 
    lastName, 
    email, 
    postcode, 
    houseNo, 
    phone, 
    role, 
    password, 
    subscriptionType,
    paymentAmount 
  } = req.body;

  if (firstName && lastName && email && postcode && houseNo && phone && 
      role && password && subscriptionType && paymentAmount) {
    auth.registerUser(
      firstName,
      lastName,
      email,
      postcode,
      houseNo,
      phone,
      role,
      password,
      subscriptionType,
      paymentAmount, 
      (err, data) => {
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
      }
    );
  } else {
    res.status(400).send({
      message: "All required fields must be filled.",
    });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = await verifyJWT(req, res);
  if (!userId) return;

  auth.getNotifications(userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error retrieving notifications" 
      });
    } else {
      res.status(200).send({ notifications: data });
    }
  });
};

exports.markNotificationRead = async (req, res) => {
  const userId = await verifyJWT(req, res);
  if (!userId) return;

  const notificationId = req.params.notificationId;

  auth.markNotificationRead(notificationId, userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error marking notification as read",
      });
      console.log(err);
    } else {
      res.status(200).send({
        message: "Notification marked as read",
      });
    }
  });
};

exports.deleteNotification = async (req, res) => {
  const userId = await verifyJWT(req, res);
  if (!userId) return;

  const notificationId = req.params.notificationId;

  auth.deleteNotification(notificationId, userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error deleting notification",
      });
      console.log(err);
    } else {
      res.status(200).send({
        message: "Notification deleted successfully",
      });
    }
  });
};