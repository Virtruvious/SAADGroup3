const pool = require("../db.ts");

// Constructor
const Book = function (book) {
  this.title = book.title;
};

Book.getNewBooks = (result) => {
  pool
    .execute("SELECT * FROM media WHERE media_type = 'book' ORDER BY publication_year DESC LIMIT 10;")
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
}

Book.getRandomBooks = (result) => {
  pool
    .execute("SELECT * FROM media WHERE media_type = 'book' ORDER BY RAND() LIMIT 10;")
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
}

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
}

module.exports = Book;
