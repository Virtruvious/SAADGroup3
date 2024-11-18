const mysql = require("mysql2");
require('dotenv').config();

// Create a connection to the database
const dbPool = mysql.createPool({
    host: "localhost",
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: 3306,
    database: "aml",
});

module.exports = dbPool.promise();