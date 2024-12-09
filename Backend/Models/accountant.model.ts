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

Accountant.createNotification = async (userId, message, type) => {
  const query = `
    INSERT INTO notifications (
      user_id,
      message,
      type
    ) VALUES (?, ?, ?)
  `;
  
  try {
    await pool.execute(query, [userId, message, type]);
    return true;
  } catch (err) {
    console.error("Error creating notification:", err);
    return false;
  }
};

Accountant.adjustPayment = async (paymentId, adjustment, userId, reason, result) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const [memberRows] = await connection.execute(
        `SELECT u.user_id, u.first_name, u.last_name 
         FROM payment p
         JOIN subscription s ON p.subscription_id = s.subscription_id
         JOIN user u ON s.subscription_id = u.subscription_id
         WHERE p.payment_id = ?`,
        [paymentId]
      );

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

      if (memberRows.length > 0) {
        const member = memberRows[0];
        const message = `Your payment has been adjusted by £${Math.abs(adjustment)}. Reason: ${reason}`;
        await Accountant.createNotification(member.user_id, message, 'payment_adjustment');
      }
  
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

Accountant.getSubscriptionPlans = (result) => {
  const query = `
    SELECT *
    FROM subscription_plans
    ORDER BY price ASC
  `;
  
  pool.execute(query)
    .then(([rows]) => result(null, rows))
    .catch((err) => {
      console.error("Error retrieving subscription plans:", err);
      result(err, null);
    });
};

Accountant.changeMembershipType = async (userId, newType, reason, currentSubscriptionId, adjustedBy) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // get subscription plan details
    const [planRows] = await connection.execute(
      `SELECT * FROM subscription_plans WHERE name = ?`,
      [newType]
    );
    
    if (planRows.length === 0) {
      throw new Error("Invalid subscription plan");
    }
    
    const plan = planRows[0];
    
    // update subscription
    await connection.execute(
      `UPDATE subscription 
       SET subscription_type = ?, plan_id = ?
       WHERE subscription_id = ?`,
      [newType, plan.plan_id, currentSubscriptionId]
    );
    
    // get current payment details
    const [paymentRows] = await connection.execute(
      `SELECT * FROM payment 
       WHERE subscription_id = ? 
       ORDER BY payment_date DESC LIMIT 1`,
      [currentSubscriptionId]
    );
    
    if (paymentRows.length > 0) {
      const currentPayment = paymentRows[0];
      const priceDifference = plan.price - currentPayment.amount;
      
      // create payment adjustment if there's a price difference
      if (priceDifference !== 0) {
        await connection.execute(
          `INSERT INTO payment_adjustments 
           (payment_id, amount, reason, adjusted_by, adjustment_date)
           VALUES (?, ?, ?, ?, NOW())`,
          [currentPayment.payment_id, priceDifference, reason, adjustedBy]
        );
        
        // update payment amount and status
        await connection.execute(
          `UPDATE payment 
           SET amount = ?, 
               reconciliation_status = CASE
                 WHEN ? = original_amount THEN 'matched'
                 WHEN ? < original_amount THEN 'underpaid'
                 ELSE 'overpaid'
               END
           WHERE payment_id = ?`,
          [plan.price, plan.price, plan.price, currentPayment.payment_id]
        );
      }
      
      // create notification with valid enum type
      const message = `Your membership has been changed to ${newType}. ${priceDifference !== 0 ? `Payment adjusted by £${Math.abs(priceDifference)}.` : ''} Reason: ${reason}`;
      await connection.execute(
        `INSERT INTO notifications (user_id, message, type, date, \`read\`)
         VALUES (?, ?, 'system', NOW(), 0)`,
        [userId, message]
      );
    }
    
    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error("Error changing membership:", err);
    throw err;
  } finally {
    connection.release();
  }
};

Accountant.getPaymentMethodSummary = async (timeFrame, result) => {
  let timeCondition = '';
  switch(timeFrame) {
    case 'today':
      timeCondition = 'WHERE DATE(p.payment_date) = CURDATE()';
      break;
    case 'week':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
      break;
    case 'month':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
      break;
    case 'year':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
      break;
    default:
      timeCondition = '';
  }

  const query = `
    SELECT 
      payment_method,
      COUNT(*) as total_transactions,
      SUM(amount) as total_amount
    FROM payment p
    ${timeCondition}
    GROUP BY payment_method
    ORDER BY total_transactions DESC
  `;

  try {
    const [rows] = await pool.execute(query);
    result(null, rows);
  } catch (err) {
    console.error("Error getting payment method summary:", err);
    result(err, null);
  }
};


Accountant.getExtendedAnalytics = async (timeFrame, result) => {
  let timeCondition = '';
  
  switch(timeFrame) {
    case 'today':
      timeCondition = 'WHERE DATE(p.payment_date) = CURDATE()';
      break;
    case 'week':
      timeCondition = 'WHERE YEARWEEK(p.payment_date) = YEARWEEK(CURDATE())';
      break;
    case 'month':
      timeCondition = `WHERE YEAR(p.payment_date) = YEAR(CURDATE()) 
                      AND MONTH(p.payment_date) = MONTH(CURDATE())`;
      break;
    case 'year':
      timeCondition = 'WHERE YEAR(p.payment_date) = YEAR(CURDATE())';
      break;
    default:
      timeCondition = '';
  }

  const query = `
    SELECT 
      COUNT(DISTINCT p.payment_id) as total_payments,
      SUM(CASE WHEN p.amount = sp.price THEN 1 ELSE 0 END) as matched_payments,
      SUM(CASE WHEN p.amount < sp.price THEN 1 ELSE 0 END) as underpaid,
      SUM(CASE WHEN p.amount > sp.price THEN 1 ELSE 0 END) as overpaid,
      COALESCE(SUM(p.amount), 0) as total_amount,
      COALESCE(AVG(DATEDIFF(p.payment_date, s.start_date)), 0) as avg_payment_delay
    FROM payment p
    JOIN subscription s ON p.subscription_id = s.subscription_id
    LEFT JOIN user u ON s.subscription_id = u.subscription_id
    LEFT JOIN subscription_plans sp ON s.plan_id = sp.plan_id
    ${timeCondition}
  `;

  try {
    const [rows] = await pool.execute(query);
    result(null, rows);
  } catch (err) {
    console.error("Error getting extended analytics:", err);
    result(err, null);
  }
};

Accountant.getOutstandingBalances = async (result) => {
  const query = `
    SELECT 
      CONCAT(u.first_name, ' ', u.last_name) as memberName,
      s.subscription_type,
      sp.price - COALESCE(SUM(p.amount), 0) as balance,
      MAX(p.payment_date) as last_payment_date
    FROM user u
    JOIN subscription s ON u.subscription_id = s.subscription_id
    JOIN subscription_plans sp ON s.plan_id = sp.plan_id
    LEFT JOIN payment p ON s.subscription_id = p.subscription_id
    WHERE sp.price > COALESCE(p.amount, 0)
    GROUP BY u.user_id, u.first_name, u.last_name, s.subscription_type, sp.price
    HAVING sp.price > COALESCE(SUM(p.amount), 0)
    ORDER BY balance DESC
  `;

  try {
    const [rows] = await pool.execute(query);
    result(null, rows);
  } catch (err) {
    console.error("Error getting outstanding balances:", err);
    result(err, null);
  }
};

Accountant.exportReport = async (type, timeFrame, result) => {
  let timeCondition = '';
  switch(timeFrame) {
    case 'today':
      timeCondition = 'WHERE DATE(p.payment_date) = CURDATE()';
      break;
    case 'week':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
      break;
    case 'month':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
      break;
    case 'year':
      timeCondition = 'WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
      break;
    default:
      timeCondition = '';
  }

  let query = '';
  switch(type) {
    case 'revenue':
      query = `
        SELECT 
          p.payment_date,
          CONCAT(u.first_name, ' ', u.last_name) as member_name,
          p.amount,
          p.payment_method,
          s.subscription_type
        FROM payment p
        JOIN subscription s ON p.subscription_id = s.subscription_id
        JOIN user u ON s.subscription_id = u.subscription_id
        ${timeCondition}
      `;
      break;
    case 'reconciliation':
      query = `
        SELECT 
          CONCAT(u.first_name, ' ', u.last_name) as member_name,
          p.payment_date,
          p.amount as paid_amount,
          sp.price as expected_amount,
          CASE 
            WHEN p.amount = sp.price THEN 'Matched'
            WHEN p.amount < sp.price THEN 'Underpaid'
            WHEN p.amount > sp.price THEN 'Overpaid'
          END as status,
          ABS(p.amount - sp.price) as difference_amount,
          p.payment_method
        FROM payment p
        JOIN subscription s ON p.subscription_id = s.subscription_id
        JOIN user u ON s.subscription_id = u.subscription_id
        JOIN subscription_plans sp ON s.plan_id = sp.plan_id
        ${timeCondition}
      `;
      break;
    case 'methods':
      query = `
        SELECT 
          p.payment_method,
          COUNT(*) as total_transactions,
          SUM(p.amount) as total_amount,
          AVG(p.amount) as average_amount
        FROM payment p
        ${timeCondition}
        GROUP BY p.payment_method
        ORDER BY total_transactions DESC
      `;
      break;
    case 'outstanding':
      query = `
        SELECT 
          CONCAT(u.first_name, ' ', u.last_name) as member_name,
          s.subscription_type,
          sp.price as expected_amount,
          COALESCE(p.amount, 0) as paid_amount,
          sp.price - COALESCE(p.amount, 0) as outstanding_balance,
          p.payment_date as last_payment_date
        FROM user u
        JOIN subscription s ON u.subscription_id = s.subscription_id
        JOIN subscription_plans sp ON s.plan_id = sp.plan_id
        LEFT JOIN payment p ON s.subscription_id = p.subscription_id
        WHERE sp.price > COALESCE(p.amount, 0)
        ${timeCondition ? 'AND ' + timeCondition.substring(6) : ''}
      `;
      break;
    default:
      throw new Error(`Unsupported report type: ${type}`);
  }

  try {
    const [rows] = await pool.execute(query);
    result(null, rows);
  } catch (err) {
    console.error("Error exporting report:", err);
    result(err, null);
  }
};
module.exports = Accountant;