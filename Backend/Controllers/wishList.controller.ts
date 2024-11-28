const WishList = require("../Models/wishList.model");
const jwt = require("jsonwebtoken");

function generateAccessToken(param){
  return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '1800s'});
}

exports.addMedia = (req, res) => {
    const { email, mediaId } = req.body;
    
    if (email && mediaId) {
        WishList.addMedia(email, mediaId, (err, data) => {
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
        message: "Email and mediaId cannot be empty",
        });
    }
    }

exports.getWishList = (req, res) => {
    const email = req.query.email;
    
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
}

exports.removeMedia = (req, res) => {
    const { email, mediaId } = req.body;
    
    if (email && mediaId) {
        WishList.removeMedia(email, mediaId, (err, data) => {
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
        message: "Email and mediaId cannot be empty",
        });
    }
}