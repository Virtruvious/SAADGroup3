const WishList = require("../Models/wishList.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res) {
  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const JWT = req.headers.authorization.split(" ")[1];
  let email = null;
  if (!JWT) {
    res.status(401).send("Unauthorized");
    return null;
  } else {
    jwt.verify(JWT, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized");
        return null;
      } else {
        email = decoded.email;
      }
    });
    return email;
  }
}

exports.addMedia = async (req, res) => {
  const mediaID = req.query.ID;
  const email = await verifyJWT(req, res);
  if (!email) return;

  if (mediaID) {
    WishList.addMedia(email, mediaID, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Error adding media to wishlist",
        });
      } else {
        res.status(200).send({
          message: "Media added to wishlist",
        });
      }
    });
  } else {
    res.status(400).send({
      message: "Media ID cannot be empty",
    });
  }
};

exports.getWishList = async (req, res) => {
  const email = await verifyJWT(req, res);
  if (!email) return;

  if (email) {
    WishList.getWishList(email, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Error retrieving wishlist",
        });
      } else {
        res.status(200).send(data);
      }
    });
  } else {
    res.status(400).send({
      message: "Email cannot be empty",
    });
  }
};

exports.removeMedia = async (req, res) => {
  const mediaID = req.query.ID;
  const email = await verifyJWT(req, res);
  if (!email) return;

  if (mediaID) {
    WishList.removeMedia(email, mediaID, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Error deleting media from wishlist",
        });
      } else {
        res.status(200).send({
          message: "Media deleted from wishlist",
        });
      }
    });
  } else {
    res.status(400).send({
      message: "Media ID cannot be empty",
    });
  }
};
