const pool = require("../db.ts");

const Accountant = function (accountant) {
 this.name = accountant.name;
};

Accountant.getAllMembers = (result) => {
 const query = `
   SELECT 
       user.*,
       subscription.*,
       payment.*,
       sp.price as subscription_price
   FROM user
   LEFT JOIN subscription ON user.subscription_id = subscription.subscription_id
   LEFT JOIN subscription_plans sp ON subscription.plan_id = sp.plan_id
   LEFT JOIN payment ON subscription.subscription_id = payment.subscription_id
   WHERE user.role = 'user';
 `;

 pool.execute(query)
   .then(([rows]) => result(null, rows))
   .catch((err) => {
     console.error("Error retrieving members:", err);
     result(err, null);
   });
};

Accountant.payments = (result) => {
 const query = `
   WITH payment_summary AS (
     SELECT 
         p.payment_id as id,
         CONCAT(u.first_name, ' ', u.last_name) as memberName,
         s.subscription_type,
         p.amount as amountPaid,
         sp.price as expected_amount,
         p.payment_date,
         p.payment_method,
         CASE
             WHEN p.amount < sp.price THEN sp.price - p.amount
             ELSE 0
         END as balance,
         CASE 
             WHEN p.amount = sp.price THEN 'Matched'
             WHEN p.amount < sp.price THEN 'Underpaid'
             WHEN p.amount > sp.price THEN 'Overpaid'
             ELSE 'Pending'
         END as reconciliation_status,
         DATEDIFF(p.payment_date, s.start_date) as days_from_due
     FROM 
         user u
         JOIN subscription s ON u.subscription_id = s.subscription_id
         JOIN subscription_plans sp ON s.plan_id = sp.plan_id
         JOIN payment p ON s.subscription_id = p.subscription_id
     WHERE u.role = 'user'
   )
   SELECT * FROM payment_summary
   ORDER BY payment_date DESC;
 `;
 
 pool.execute(query)
   .then(([rows]) => result(null, rows))
   .catch((err) => {
     console.error("Error retrieving payments:", err);
     result(err, null);
   });
};

Accountant.createPaymentAdjustment = (adjustmentData, result) => {
    const query = `
    INSERT INTO payment_adjustments (
        payment_id, 
        amount, 
        reason, 
        adjusted_by,
        adjustment_date
    ) VALUES (?, ?, ?, ?, NOW())`;

    pool.execute(query, [
        adjustmentData.payment_id,
        adjustmentData.amount,
        adjustmentData.reason,
        adjustmentData.adjustedBy
    ])
    .then(([rows]) => {
        result(null, rows);
    })
    .catch((err) => {
        result(err, null);
    });
};

Accountant.adjustPayment = async (paymentId, adjustment, userId, reason, result) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      await connection.execute(
        `UPDATE payment 
         SET amount = amount + ?, 
             reconciliation_status = CASE
               WHEN amount + ? = original_amount THEN 'matched'
               WHEN amount + ? < original_amount THEN 'underpaid'
               ELSE 'overpaid'
             END
         WHERE payment_id = ?`,
        [adjustment, adjustment, adjustment, paymentId]
      );
  
      await connection.execute(
        `INSERT INTO payment_adjustments (
          payment_id, amount, reason, adjusted_by, adjustment_date
        ) VALUES (?, ?, ?, ?, NOW())`,
        [paymentId, adjustment, reason, userId]
      );
  
      await connection.commit();
      result(null, { success: true });
    } catch (err) {
      await connection.rollback();
      console.error("Error adjusting payment:", err);
      result(err, null);
    } finally {
      connection.release();
    }
  };

Accountant.getPaymentHistory = (memberId, result) => {
 const query = `
   SELECT 
     p.*,
     pa.amount as adjustment_amount,
     pa.reason,
     pa.adjustment_date,
     CONCAT(u.first_name, ' ', u.last_name) as adjusted_by
   FROM payment p
   LEFT JOIN payment_adjustments pa ON p.payment_id = pa.payment_id
   LEFT JOIN user u ON pa.adjusted_by = u.user_id
   WHERE p.subscription_id = (
     SELECT subscription_id FROM user WHERE user_id = ?
   )
   ORDER BY p.payment_date DESC, pa.adjustment_date DESC
 `;

 pool.execute(query, [memberId])
   .then(([rows]) => result(null, rows))
   .catch(err => result(err, null));
};

Accountant.getAllPaymentsHistory = (result) => {
  const query = `
    SELECT 
    p.*,
    pa.amount as adjustment_amount,
    pa.reason,
    pa.adjustment_date,
    CONCAT(adjuster.first_name, ' ', adjuster.last_name) as adjusted_by,
    CONCAT(member.first_name, ' ', member.last_name) as member_name
FROM payment p
LEFT JOIN payment_adjustments pa ON p.payment_id = pa.payment_id
LEFT JOIN user adjuster ON pa.adjusted_by = adjuster.user_id
LEFT JOIN subscription s ON p.subscription_id = s.subscription_id
LEFT JOIN user member ON s.subscription_id = member.subscription_id
ORDER BY p.payment_date DESC, pa.adjustment_date DESC
  `;
  
  pool.execute(query)
    .then(([rows]) => result(null, rows))
    .catch(err => result(err, null));
  };



Accountant.getPaymentAnalytics = (result) => {
 const query = `
   SELECT 
     COUNT(*) as total_payments,
     SUM(CASE WHEN p.amount = sp.price THEN 1 ELSE 0 END) as matched_payments,
     SUM(CASE WHEN p.amount < sp.price THEN 1 ELSE 0 END) as underpaid,
     SUM(CASE WHEN p.amount > sp.price THEN 1 ELSE 0 END) as overpaid,
     SUM(p.amount) as total_amount,
     AVG(DATEDIFF(p.payment_date, s.start_date)) as avg_payment_delay
   FROM payment p
   JOIN subscription s ON p.subscription_id = s.subscription_id
   JOIN subscription_plans sp ON s.plan_id = sp.plan_id
 `;

 pool.execute(query)
   .then(([rows]) => result(null, rows))
   .catch(err => result(err, null));
};

Accountant.getMemberInfo = (memberId, result) => {
 const query = `
   SELECT 
     u.*,
     s.*,
     p.*,
     sp.price
   FROM user u
   LEFT JOIN subscription s ON u.subscription_id = s.subscription_id
   LEFT JOIN subscription_plans sp ON s.plan_id = sp.plan_id
   LEFT JOIN payment p ON s.subscription_id = p.subscription_id
   WHERE u.user_id = ?
 `;

 pool.execute(query, [memberId])
   .then(([rows]) => result(null, rows))
   .catch(err => {
     console.error("Error retrieving member info:", err);
     result(err, null);
   });
};

module.exports = Accountant;