const pool = require("../db.ts");
const bcrypt = require("bcrypt");

// Constructor
const User = function (user) {
  this.email = user.email;
};

User.checkPassword = (email, password, result) => {
  pool
    .execute("SELECT * FROM user INNER JOIN subscription ON user.subscription_id = subscription.subscription_id WHERE user.email = ?;", [email])
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
  pool
    .execute("SELECT * FROM user INNER JOIN subscription ON user.subscription_id = subscription.subscription_id WHERE user.email = ? and role = 'staff';", [email])
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
}

User.registerUser = async (firstName, lastName, email, postcode, houseNo, phone, role, password, subscriptionType, result) => {
  // Create Subscription
  const currentDate = new Date();
  let endDate = new Date();
  let subscriptionID;
  let subscriptionCost;

  if (await User.checkEmail(email)) {
    // Email already exists
    result({ kind: "duplicate" }, null);
    return;
  }
  if(role == "user"){
  if (subscriptionType === "monthly") {
    endDate.setMonth(currentDate.getMonth() + 1);
    subscriptionCost = 10.0;
  } else if (subscriptionType === "annual") {
    endDate.setFullYear(currentDate.getFullYear() + 1);
    subscriptionCost = 99.0;
  } else {
    // Invalid subscription type
    result({ kind: "invalid_subscription" }, null);
  }
  try{
    //get id and insert into subscription
    const [subscriptionResult] = await pool.execute("INSERT INTO subscription (subscription_type, start_date, end_date, status) VALUES (?, ?, ?, ?)", 
    [subscriptionType, currentDate, endDate, 1]);
    subscriptionID = subscriptionResult.insertId;

    await pool.execute("INSERT INTO payment (subscription_id, amount, payment_date, payment_method, status) VALUES (?, ?, ?, ?,?)",
      [subscriptionID, subscriptionCost, currentDate, "inhouse", 1]);
  } catch(err) {
    if (err.code === "ER_DUP_ENTRY") {
      // Duplicate entry
      result({ kind: "duplicate" }, null);
    } else {
      console.error("Error during subscription/payment creation: ", err);
      result(err, null);
      return;
    }
  }
}
else if(role == "staff"){
  subscriptionID = -1;
}

  // Create User with hashed password
  let saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    pool
      .execute("INSERT INTO user (first_name, last_name, email, postcode, house_number, phone, role, password, subscription_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        firstName,
        lastName,
        email,
        postcode,
        houseNo,
        phone,
        role,
        hash,
        subscriptionID,
      ])
      .then(([rows]) => {
        // console.log("Created user: ", rows);
        result(null, rows);
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          // Duplicate entry
          result({ kind: "duplicate" }, null);
        } else {
          console.error("Error: ", err);
          result(err, null);
        }
      });
  });
};


module.exports = User;
