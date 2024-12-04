const books = require("../Models/books.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res, staff = false) {
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
        if (staff && decoded.role !== "staff") {
          res.status(403).send("Forbidden");
          return null;
        }
        // console.log("decoded: ", decoded);
        user_id = decoded.id;
      }
    });
    return user_id;
  }
}

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

exports.getBookInfo = (req, res) => {
  const bookId = req.params.bookId;
  if (!bookId) {
    res.status(400).send({
      message: "Book ID cannot be empty",
    });
  }
  books.getBookInfo(bookId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error Fetching Book Info",
      });
      console.log(err);
    } else {
      const successfulRes = {
        book: data,
      };
      res.status(200).send(successfulRes);
    }
  });
};

exports.getBookInfoByName = (req, res) => {
  const searchQuery = req.query.query;
  
  if (!searchQuery) {
    return res.status(400).send({
      message: "Search Query cannot be empty",
    });
  }

  books.getBookInfoByName(searchQuery, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: "Error Fetching Book Info by Name",
      });
    }
    console.log("data: ", data);
    
    res.status(200).send({
      books: data});
  });
};

exports.reserveBook = async (req, res) => {
  const bookId = req.params.bookId;
  if (!bookId) {
    res.status(400).send({
      message: "Book ID cannot be empty",
    });
  }
  const user_id = await verifyJWT(req, res);
  if (!user_id) return;

  books.reserveBook(bookId, user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: "Book not found",
        });
      } else if (err.kind === "already_reserved") {
        res.status(400).send({
          message: "User has already reserved this book",
        });
      }
    } else {
      console.log("Book Reserversation Requested (ID: " + data.insertId + ")");
      const successfulRes = {
        message: "Book Reserversation Requested (ID: " + data.insertId + ")",
      };
      res.status(200).send(successfulRes);
    }
  });
};

exports.cancelReservation = async (req, res) => {
  const mediaId = req.params.mediaId;
  if (!mediaId) {
    res.status(400).send({
      message: "Media ID cannot be empty",
    });
  }
  const user_id = await verifyJWT(req, res);
  if (!user_id) return;

  books.cancelReservation(mediaId, user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: "Media Reservation for user not found",
        });
      }
    } else {
      const successfulRes = {
        message: "Reservation Cancelled",
      };
      res.status(200).send(successfulRes);
    }
  });
}

exports.borrowBook = async (req, res) => {
  const bookId = req.params.bookId;
  if (!bookId) {
    res.status(400).send({
      message: "Book ID cannot be empty",
    });
  }
  const user_id = await verifyJWT(req, res);
  if (!user_id) return;

  books.borrowBook(bookId, user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: "Book not found",
        });
      } else if (err.kind === "already_borrowed") {
        res.status(400).send({
          message: "User has already actively borrowed this book",
        });
      }
    } else {
      const successfulRes = {
        message: "Book Borrow Requested (ID: " + data.insertId + ")",
      };
      res.status(200).send(successfulRes);
    }
  });
};

exports.cancelBorrow = async (req, res) => {
  const mediaId = req.params.mediaId;
  if (!mediaId) {
    res.status(400).send({
      message: "Media ID cannot be empty",
    });
  }
  const user_id = await verifyJWT(req, res);
  if (!user_id) return;

  books.cancelBorrow(mediaId, user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found_or_already_returned") {
        res.status(400).send({
          message: "Media Borrowing for user not found",
        });
      }
    } else {
      const successfulRes = {
        message: "Borrow Cancelled",
      };
      res.status(200).send(successfulRes);
    }
  });
}

exports.editReservation = async (req, res) => {
  const reservationId = req.params.reservationId;
  if (!reservationId) {
    res.status(400).send({
      message: "Reservation ID cannot be empty",
    });
  }
  const { newStatus } = req.body;
  const user_id = await verifyJWT(req, res, true);
  if (!user_id) return;

  console.log("newStatus: ", newStatus);

  if (newStatus !== "reserved" && newStatus !== "cancelled") {
    res.status(400).send({
      message: "Invalid or empty status",
    });
  } else {
    books.editReservation(reservationId, newStatus, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(400).send({
            message: "Reservation not found",
          });
        }
      } else {
        const successfulRes = {
          message: "Reservation Edited (ID: " + reservationId + ")",
        };
        res.status(200).send(successfulRes);
      }
    });
  }
};

exports.editBorrow = async (req, res) => {
  const borrowId = req.params.borrowId;
  if (!borrowId) {
    res.status(400).send({
      message: "Borrow ID cannot be empty",
    });
  }
  const { newStatus } = req.body;
  const user_id = await verifyJWT(req, res, true);
  if (!user_id) return;

  if (newStatus !== "borrowed" && newStatus !== "returned") {
    res.status(400).send({
      message: "Invalid or empty status",
    });
  } else {
    books.editBorrow(borrowId, newStatus, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(400).send({
            message: "Borrow not found",
          });
        }
      } else {
        const successfulRes = {
          message: "Borrow Edited (ID: " + borrowId + ")",
        };
        res.status(200).send(successfulRes);
      }
    });
  }
};

exports.getUserSpecificInfo = async (req, res) => {
  const bookId = req.params.bookId;
  if (!bookId) {
    res.status(400).send({
      message: "Book ID cannot be empty",
    });
  }
  const user_id = await verifyJWT(req, res);
  if (!user_id) return;

  books.getUserSpecificInfo(bookId, user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: "Book not found",
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};
