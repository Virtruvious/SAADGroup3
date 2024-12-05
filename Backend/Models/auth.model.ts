const pool = require("../db.ts");
const bcrypt = require("bcrypt");

// Constructor
const User = function (user) {
  this.email = user.email;
};

User.checkPassword = (email, password, result) => {
  pool
    .execute(
      "SELECT * FROM user INNER JOIN subscription ON user.subscription_id = subscription.subscription_id INNER JOIN subscription_plans ON subscription.plan_id = subscription_plans.plan_id WHERE user.email = ?;",
      [email]
    )
    .then(([rows]) => {
      if (rows.length == 1) {
        // To be used when password is hashed
        bcrypt.compare(password, rows[0].password, (err, res) => {
          if (res) {
            // console.log("Found user: ", rows[0]);
            result(null, rows[0]);
          } else {
            // Invalid password
            result({ kind: "invalid_password" }, null);
          }
        });
      } else {
        // Not found User with the username
        result({ kind: "not_found" }, null);
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

User.checkPasswordStaff = (email, password, result) => {
  console.log("Checking staff password: ", email);
  pool
    .execute(
      "SELECT * FROM user WHERE user.email = ? AND role = 'staff';",
      [email]
    )
    .then(([rows]) => {
      if (rows.length == 1) {
        // To be used when password is hashed
        bcrypt.compare(password, rows[0].password, (err, res) => {
          if (res) {
            // console.log("Found user: ", rows[0]);
            result(null, rows[0]);
          } else {
            // Invalid password
            result({ kind: "invalid_password" }, null);
          }
        });
      } else {
        // Not found User with the username
        result({ kind: "not_found" }, null);
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

User.checkEmail = (email: string): Promise<boolean> => {
  console.log("Checking email: ", email);
  return pool
    .execute("SELECT * FROM user WHERE email = ?;", [email])
    .then(([rows]) => {
      if (rows.length == 1) {
        console.log("Email exists: ", rows[0].email);
        return true; // Email exists
      } else {
        console.log("Email does not exist: ", email);
        return false; // Email does not exist
      }
    })
    .catch((err: Error) => {
      console.error("Error: ", err);
      return false; // Handle error by returning false
    });
};

User.registerUser = async (firstName, lastName, email, postcode, houseNo, phone, role, password, subscriptionType, result) => {
  const connection = await pool.getConnection();
  
  try {
    if (await User.checkEmail(email)) {
      return result({ kind: "duplicate" }, null);
    }

    await connection.beginTransaction();
    
    let subscriptionID = -1;
    if (role === "user") {
      const [plans] = await connection.execute(
        "SELECT * FROM subscription_plans WHERE name = ?",
        [subscriptionType]
      );
      
      if (!plans.length) {
        throw { kind: "invalid_subscription" };
      }

      const plan = plans[0];
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + plan.duration);

      const [subscriptionResult] = await connection.execute(
        "INSERT INTO subscription (subscription_type, start_date, end_date, status, plan_id) VALUES (?, ?, ?, ?, ?)",
        [subscriptionType, currentDate, endDate, 1, plan.plan_id]
      );
      subscriptionID = subscriptionResult.insertId;

      await connection.execute(
        "INSERT INTO payment (subscription_id, amount, original_amount, payment_date, payment_method, status, reconciliation_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [subscriptionID, plan.price, plan.price, currentDate, "inhouse", 1, "matched"]
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      "INSERT INTO user (first_name, last_name, email, postcode, house_number, phone, role, password, subscription_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, postcode, houseNo, phone, role, hash, subscriptionID]
    );

    await connection.commit();
    result(null, userResult);
  } catch (err) {
    await connection.rollback();
    handleRegistrationError(err, result);
  } finally {
    connection.release();
  }
};

const handleRegistrationError = (err, result) => {
  if (err.code === "ER_DUP_ENTRY") result({ kind: "duplicate" }, null);
  else if (err.kind === "invalid_subscription") result(err, null);
  else {
    console.error("Registration error:", err);
    result(err, null);
  }
};

module.exports = User;
