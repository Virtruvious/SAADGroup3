const pool = require("../db.ts");

const Admin = function (admin) {
  this.name = admin.name;
};

Admin.getReport = async (timeFrame, result) => {
  let timeCondition = "";

  switch (timeFrame) {
    case "today":
      timeCondition = "WHERE DATE(p.payment_date) = CURDATE()";
      break;
    case "week":
      timeCondition = "WHERE YEARWEEK(p.payment_date) = YEARWEEK(CURDATE())";
      break;
    case "month":
      timeCondition = `WHERE YEAR(p.payment_date) = YEAR(CURDATE()) 
                      AND MONTH(p.payment_date) = MONTH(CURDATE())`;
      break;
    case "year":
      timeCondition = "WHERE YEAR(p.payment_date) = YEAR(CURDATE())";
      break;
    default:
      timeCondition = "";
  }

  const userQuery = `SELECT COUNT(DISTINCT user_id) AS total_active_users FROM user WHERE role = "user"`;
  const borrowQuery = `SELECT COUNT(*) AS total_books_borrowed FROM borrowing`;
  const reserveQuery = `SELECT COUNT(*) AS total_reserved_books FROM reservation`;
  const topBooksQuery = `
    SELECT m.media_id, m.title, COUNT(m.media_id) AS number_of_borrows
    FROM borrowing br
    JOIN media m ON br.media_id = m.media_id
    GROUP BY m.media_id, m.title
    ORDER BY number_of_borrows DESC
    LIMIT 10
  `;

  try {
    const users = await pool.query(userQuery);
    const borrows = await pool.query(borrowQuery);
    const reserves = await pool.query(reserveQuery);
    const topBooks = await pool.query(topBooksQuery);

    const response = {
      stats: {
        total_active_users: users[0][0]['total_active_users'],
        total_books_borrowed: borrows[0][0]['total_books_borrowed'],
        total_reserved_books: reserves[0][0]['total_reserved_books'],
      },
      perf: {
        uptime: 99.98,
        response_time: 0.5,
        newErrors: 0,
      },
      topBooks: topBooks[0]
    };
    result(null, response);
  } catch (err) {
    console.error("Error getting extended analytics:", err);
    result(err, null);
  }
};

module.exports = Admin;
