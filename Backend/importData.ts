import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
require("dotenv").config();
let mysql = require("mysql2");

const subscriptionPlans = [
  [
    "monthly",
    10,
    1,
    "monthly",
  ],
  [
    "annual",
    99,
    12,
    "yearly",
  ],
];

const branch = [
  [
    "Central Library",
    "123 Main St, Downtown",
  ],
  [
    "North Branch",
    "456 North St, Northtown",
  ],
  [
    "East Branch",
    "101 East St, Easttown",
  ],
];

const vendors = [
  [
    "BookWorld Publishing",
    "orders@bookworld.com",
    "123-456-7890",
    "123 Book St, Booktown",
    "John Smith",
    "books",
  ],
  [
    "Digital Media Inc.",
    "sales@digitalmedia.com",
    "987-654-3210",
    "456 Media St, Mediatown",
    "Sarah Johnson",
    "DVDs",
  ],
  [
    "Academic Press Ltd",
    "orders@academicpress.com",
    "321-654-9870",
    "789 Academic St, Academictown",
    "Michael Brown",
    "Journals",
  ],
  [
    "Gaming Universe",
    "supply@gaminguniv.com",
    "456-789-1230",
    "101 Game St, Gametown",
    "Emily White",
    "Games",
  ],
  [
    "Sound & Vision Inc",
    "orders@soundvision.com",
    "654-789-1230",
    "654 Audio Lane, Music City",
    "David Black",
    "Music",
  ]
]

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
        description: string;
      }) => {
        const { title, author, publication_year, availability, price, image, description } =
          record;

        const publicationDate = new Date(`${publication_year}-01-01`);
        processedBooks.push([
          title,
          author,
          "book",
          publicationDate,
          availability,
          price,
          image,
          description
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
    "INSERT INTO media (title, author, media_type, publication_year, availability, price, image, description) VALUES ?";
  con.query(sql, [processedBooks], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  // Insert subscription plans
  let planSQL =
    "INSERT INTO subscription_plans (name, price, duration, billing_frequency) VALUES ?";
  con.query(planSQL, [subscriptionPlans], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  let staffSubSQL = 
    "INSERT INTO subscription (subscription_id, subscription_type, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)";
  con.query(staffSubSQL, [-1, "Staff", new Date(), new Date(), 0], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  let branchSQL =
    "INSERT INTO branch (branch_name, location) VALUES ?";
  con.query(branchSQL, [branch], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  let vendorSQL =
    "INSERT INTO vendors (name, email, phone, address, contact_person, media_types) VALUES ?";
  con.query(vendorSQL, [vendors], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  con.end();
});
