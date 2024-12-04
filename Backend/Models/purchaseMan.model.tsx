const pool = require("../db.ts");

const PurchaseMan = function (purchaseMan) {
  this.title = purchaseMan.title;
};

PurchaseMan.getVendors = (result) => {
  pool
    .execute("SELECT * FROM vendors;")
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

PurchaseMan.getBranches = (result) => {
  pool
    .execute("SELECT branch_id, branch_name, location FROM branch;")
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

PurchaseMan.createPurchaseOrder = (purchaseData, result) => {
  let insertId;
  pool
    .execute(
      "INSERT INTO purchaseorder (vendor_id, order_date, user_id) VALUES (?, NOW(), ?);",
      [purchaseData.vendor_id, purchaseData.user_id]
    )
    .then(([rows]) => {
      insertId = rows.insertId;

      //bulk insert
      const itemValues = purchaseData.items.map((item) => [
        insertId,
        item.media_id,
        item.quantity,
        item.price,
      ]);

      // Insert order items
      return pool.query(
        "INSERT INTO purchase_order_items (order_id, media_id, quantity, price) VALUES ?",
        [itemValues]
      );
    })
    .then(() => {
      // Insert tracking record
      return pool.execute(
        "INSERT INTO tracking (order_id, status, status_date) VALUES (?, 'Pending', NOW())",
        [insertId]
      );
    })
    .then(() => {
      result(null, {
        id: insertId,
        message: "Order and items created successfully",
      });
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

PurchaseMan.getOrderDetails = (orderId, result) => {
  pool
    .execute(
      `
      SELECT 
          po.order_id,
          po.order_date,
          v.name as vendor_name,
          poi.quantity,
          poi.price,
          m.title as media_title,
          m.author,
          t.status as order_status
      FROM purchaseorder po
      JOIN vendors v ON po.vendor_id = v.vendor_id
      JOIN purchase_order_items poi ON po.order_id = poi.order_id
      JOIN media m ON poi.media_id = m.media_id
      JOIN tracking t ON po.order_id = t.order_id
      WHERE po.order_id = ?`,
      [orderId]
    )
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error:", err);
      result(err, null);
    });
};

PurchaseMan.getTrackingOrders = (result) => {
  pool
    .execute("SELECT * FROM tracking;")
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error: ", err);
      result(err, null);
    });
};

PurchaseMan.getVendorMedia = (vendorId, result) => {
  pool
    .execute(
      "SELECT m.media_id ,m.title, m.price, v.name as vendor_name FROM media m JOIN vendors v ON m.vendor_id = v.vendor_id WHERE v.vendor_id = ?",
      [vendorId]
    )
    .then(([rows]) => {
      result(null, rows);
    })
    .catch((err) => {
      console.error("Error:", err);
      result(err, null);
    });
};

PurchaseMan.createMedia = (mediaData, result) => {
  pool
    .execute(
      "INSERT INTO media (title, author, media_type, publication_year, availability, price, image, description, vendor_id) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?);",
      [
        mediaData.title,
        mediaData.author,
        mediaData.media_type,
        mediaData.publication_year,
        mediaData.price,
        mediaData.image,
        mediaData.description,
        mediaData.vendor_id,
      ]
    )
    .then(([rows]) => {
      result(null, { id: rows.insertId });
    })
    .catch((err) => {
      result(err, null);
    });
};

module.exports = PurchaseMan;
