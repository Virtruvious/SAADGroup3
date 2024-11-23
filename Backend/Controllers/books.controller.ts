const books = require("../Models/books.model");

exports.getNewBooks = (req, res) => {
  books.getNewBooks((err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error Fetching New Books",
      });
      console.log(err);
    } else {
      const successfulRes = {
        books: data,
      };
      res.status(200).send(successfulRes);
    }
  });
};

exports.getRandomBooks = (req, res) => {
  books.getRandomBooks((err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error Fetching Random Books",
      });
      console.log(err);
    } else {
      const successfulRes = {
        books: data,
      };
      res.status(200).send(successfulRes);
    }
  });
};