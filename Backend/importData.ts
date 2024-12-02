import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
require("dotenv").config();
let mysql = require("mysql2");

let processedBooks = [];
(() => {
  const csvPath = path.resolve(__dirname, "./Data/dummyBooks.csv");

  const fileContent = fs.readFileSync(csvPath, "utf8");
  parse(fileContent, { columns: true }, (err, records) => {
    if (err) {
      console.error(err);
      return;
    }

    records.forEach(
      (record: {
        title: string;
        author: string;
        publication_year: string;
        availability: string;
        price: string;
        image: string;
      }) => {
        const { title, author, publication_year, availability, price, image } =
          record;

        const publicationDate = new Date(`${publication_year}-01-01`);
        processedBooks.push([
          title,
          author,
          "book",
          publicationDate,
          availability,
          price,
          image
        ]);
      }
    );

    processedBooks.forEach((record) => {
      console.log(record);
    });
  });
})();

// Create a connection to the database, make sure ENV variables are set
let con = mysql.createConnection({
  host: "localhost",
  user: process.env.DATABASE_USERNAME, // Set this in your .env file
  password: process.env.DATABASE_PASSWORD,
  port: 3306,
  database: "aml",
});

// Insert data into the database
con.connect(function (err) {
  if (err) throw err;
  let sql =
    "INSERT INTO media (title, author, media_type, publication_year, availability, price, image) VALUES ?";
  con.query(sql, [processedBooks], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  con.end();
});
