const pool = require("../db.ts");

// Constructor
const WishList = function (user) {
  this.email = user.email;
};

//get user id
WishList.getUserId = (email) => {
  return pool
    .execute("SELECT user_id FROM `aml`.`user` WHERE email = ?;", [email])
    .then(([rows]) => {
      return rows[0].user_id;
    })
    .catch((err) => {
      console.error("Error: ", err);
      return null;
    });
};

//add media to wishlist
WishList.addMedia = async (email, mediaId, result) => {
  const currentDateTime = new Date();
  const userId = await WishList.getUserId(email);

  pool
    .execute("INSERT INTO wishlist (date_added,user_id) VALUES (?,?);", [
      currentDateTime,
      userId,
    ])
    .then(([rows]) => {
      const wishlistId = rows.insertId;
      pool
        .execute(
          "INSERT INTO mediawishlist (wishlist_id,media_id) VALUES (?,?);",
          [wishlistId, mediaId]
        )
        .then(([rows]) => {
          result(null, rows);
        })
        .catch((err) => {
          console.error("Error: ", err);
          result(err, null);
        });
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

//get wishlist for a specific user
WishList.getWishList = (email, result) => {
  pool
    .execute(
      "SELECT w.wishlist_id, m.title, m.image, mw.media_id FROM wishlist w JOIN `aml`.`mediawishlist` mw ON w.wishlist_id = mw.wishlist_id JOIN `aml`.`media` m ON mw.media_id = m.media_id JOIN `aml`.`user` u ON w.user_id = u.user_id WHERE u.email = ?;",
      [email]
    )
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

//remove media from wishlist
WishList.removeMedia = (email, mediaId, result) => {
  pool
    .getConnection()
    .then((conn) => {
      return conn
        .beginTransaction()
        .then(() => {
          // Delete from mediawishlist
          return conn.execute(
            `DELETE mw FROM mediawishlist mw
                         JOIN wishlist w ON mw.wishlist_id = w.wishlist_id
                         JOIN aml.user u ON w.user_id = u.user_id
                         WHERE mw.media_id = ? AND u.email = ?;`,
            [mediaId, email]
          );
        })
        .then(() => {
          // Delete from wishlist
          return conn.execute(
            `DELETE w FROM wishlist w
                         JOIN aml.user u ON w.user_id = u.user_id
                         WHERE w.wishlist_id NOT IN (
                             SELECT wishlist_id FROM mediawishlist
                         ) AND u.email = ?;`,
            [email]
          );
        })
        .then(() => conn.commit())
        .then(() => {
          result(null, { message: "Media and wishlist deleted successfully" });
        })
        .catch((err) => {
          conn.rollback();
          console.error("Error: ", err);
          result(err, null);
        })
        .finally(() => conn.release());
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

module.exports = WishList;
