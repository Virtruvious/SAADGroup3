const pool = require("../db.ts");

// Constructor
const Book = function (book) {
  this.title = book.title;
};

Book.getNewBooks = (result) => {
  pool
    .execute(
      "SELECT * FROM media WHERE media_type = 'book' ORDER BY publication_year DESC LIMIT 10;"
    )
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.getRandomBooks = (result) => {
  pool
    .execute(
      "SELECT * FROM media WHERE media_type = 'book' ORDER BY RAND() LIMIT 10;"
    )
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.getBookInfo = (bookId, result) => {
  pool
    .execute("SELECT * FROM media WHERE media_id = ?;", [bookId])
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.getBookInfoByName = (searchQuery, result) => {
  pool
    .execute(
      `SELECT *, 
       (CASE 
         WHEN title LIKE ? THEN 2
         WHEN author LIKE ? THEN 1
         ELSE 0 
       END) as relevance
       FROM media 
       WHERE title LIKE ? OR author LIKE ?
       ORDER BY relevance DESC, title ASC
       LIMIT 8;`,
      [
        `%${searchQuery}%`, // title match in CASE
        `%${searchQuery}%`, //  author match in CASE
        `%${searchQuery}%`, //  WHERE clause title
        `%${searchQuery}%`  //  WHERE clause author
      ]
    )
    .then(([rows]) => {
    result(null, rows);  
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.reserveBook = (bookId, user_id, result) => {
  // console.log("Reserving book: ", bookId);
  pool
    .execute("SELECT * FROM media WHERE media_id = ?;", [bookId])
    .then(([rows]) => {
      if (rows.length === 0) {
        console.error("Error: Book not found");
        result({ kind: "not_found" }, null);
        return;
      }
      const { media_id } = rows[0];
      // Check if user has already reserved this book
      pool
        .execute(
          "SELECT * FROM reservation WHERE user_id = ? AND media_id = ?;",
          [user_id, media_id]
        )
        .then(([rows]) => {
          if (rows.length > 0) {
            console.error("Error: User has already reserved this book");
            result({ kind: "already_reserved" }, null);
            return;
          }

          const today = new Date();
          const expiry = new Date(today);
          expiry.setDate(today.getDate() + 14);
          pool
            .execute(
              "INSERT INTO reservation (user_id, media_id, reservation_date, expiry_date, status) VALUES (?, ?, ?, ?, ?);",
              [user_id, media_id, today, expiry, "pending"]
            )
            .then(([rows]) => {
              result(null, rows);
            })
            .catch((err) => {
              console.error("Error: ", err);
              result(err, null);
            });
        });
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.cancelReservation = (media_id, user_id, result) => {
  pool
    .execute("DELETE FROM reservation WHERE media_id = ? AND user_id = ?;", [media_id, user_id])
    .then(([rows]) => {
      if (rows.affectedRows === 0) {
        // console.error("Error: Reservation not found");
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
}

Book.borrowBook = (bookId, user_id, result) => {
  // console.log("Borrowing book: ", bookId);
  pool
    .execute("SELECT * FROM media WHERE media_id = ?;", [bookId])
    .then(([rows]) => {
      if (rows.length === 0) {
        console.error("Error: Book not found");
        result({ kind: "not_found" }, null);
        return;
      }
      const { media_id } = rows[0];
      // Check if user has existing borrowing of this book
      pool
        .execute(
          "SELECT * FROM borrowing WHERE user_id = ? AND media_id = ? AND status != 'returned';",
          [user_id, media_id]
        )
        .then(([rows]) => {
          if (rows.length > 0) {
            console.error("Error: User has already borrowed this book");
            result({ kind: "already_borrowed" }, null);
            return;
          }

          const today = new Date();
          const dueDate = new Date(today);
          dueDate.setDate(today.getDate() + 14);
          pool
            .execute(
              "INSERT INTO borrowing (user_id, media_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, ?);",
              [user_id, media_id, today, dueDate, "pending"]
            )
            .then(([rows]) => {
              result(null, rows);
            })
            .catch((err) => {
              console.error("Error: ", err);
              result(err, null);
            });
        });
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.cancelBorrow = (mediaId, user_id, result) => {
  const returnDate = new Date();
  pool
    .execute(
      "UPDATE borrowing SET status = 'returned', return_date = ? WHERE media_id = ? AND user_id = ? AND status != 'returned';",
      [returnDate, mediaId, user_id]
    )
    .then(([rows]) => {
      if (rows.affectedRows === 0) {
        // console.error("Error: Borrowing not found or already returned");
        result({ kind: "not_found_or_already_returned" }, null);
        return;
      }
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
}

Book.editReservation = (reservationId, status, result) => {
  pool
    .execute("UPDATE reservation SET status = ? WHERE reservation_id = ?;", [
      status,
      reservationId,
    ])
    .then(([rows]) => {
      if (rows.affectedRows === 0) {
        // console.error("Error: Reservation not found");
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.getBorrowUserId = (borrowId, result) => {
  pool
    .execute("SELECT user_id FROM borrowing WHERE borrowing_id = ?;", [
      borrowId,
    ])
    .then(([rows]) => {
      if (rows.length === 0) {
        // console.error("Error: Borrowing not found");
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, rows[0].user_id);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.editBorrow = (borrowId, status, result) => {
  pool
    .execute("UPDATE borrowing SET status = ? WHERE borrowing_id = ?;", [
      status,
      borrowId,
    ])
    .then(([rows]) => {
      if (rows.affectedRows === 0) {
        // console.error("Error: Borrowing not found");
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

Book.getUserSpecificInfo = (bookId, userId, result) => {
  const response = {
    wishlist: false,
    reservation: false,
    borrow: false,
  };

  // Check if the book is in the user's wishlist
  pool
    .execute(
      "SELECT * FROM wishlist INNER JOIN mediawishlist ON wishlist.wishlist_id = mediawishlist.wishlist_id WHERE wishlist.user_id = ? AND mediawishlist.media_id = ?;",
      [userId, bookId]
    )
    .then(([rows]) => {
      if (rows.length > 0) {
        response.wishlist = true;
      }

      // Check if the user has reserved the book
      pool
        .execute(
          "SELECT * FROM reservation WHERE user_id = ? AND media_id = ?;",
          [userId, bookId]
        )
        .then(([rows]) => {
          if (rows.length > 0) {
            response.reservation = true;
          }

          // Check if the user has borrowed the book
          pool
            .execute(
              "SELECT * FROM borrowing WHERE user_id = ? AND media_id = ? AND status != 'returned';",
              [userId, bookId]
            )
            .then(([rows]) => {
              if (rows.length > 0) {
                response.borrow = true;
              }

              result(null, response);
            });
        });
    });
};

module.exports = Book;
