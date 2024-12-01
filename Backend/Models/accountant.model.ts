const pool = require("../db.ts");

// Constructor
const Accountant = function (accountant) {
    this.name = accountant.name;
};

Accountant.getAllMembers = (result) => {
    const query = `
        SELECT 
            user.user_id,
            user.first_name,
            user.last_name,
            user.email,
            user.phone,
            user.postcode,
            user.house_number,
            user.role,
            subscription.subscription_id,
            subscription.subscription_type,
            subscription.start_date,
            subscription.end_date,
            subscription.status AS subscription_status,
            payment.payment_id,
            payment.amount AS payment_amount,
            payment.payment_date,
            payment.status AS payment_status
        FROM 
            user
        LEFT JOIN 
            subscription 
        ON 
            user.subscription_id = subscription.subscription_id
        LEFT JOIN 
            payment 
        ON 
            subscription.subscription_id = payment.subscription_id
        WHERE 
            user.role = 'user';
    `;

    pool
        .execute(query)
        .then(([rows]) => {
            result(null, rows);
        })
        .catch((err) => {
            console.error("Error retrieving members: ", err);
            result(err, null);
        });
};

Accountant.payments = (result) => {
    const query =`
    WITH payment_summary AS (
    SELECT 
        -- Include p.payment_id in GROUP BY since it's part of the SELECT list
        MIN(p.payment_id) AS id,  -- Use MIN or MAX to get one payment_id per user
        CONCAT(u.first_name, ' ', u.last_name) AS memberName,
        s.subscription_type,
        SUM(p.amount) AS amountPaid,
        MAX(p.payment_date) AS paymentDate,  -- Get the latest payment date
        MAX(p.payment_method) AS paymentMethod,  -- Get the latest payment method
        -- Calculate balance as the difference between subscription fee and payments made
        (CASE 
            WHEN s.subscription_type = 'monthly' THEN 10 
            WHEN s.subscription_type = 'annual' THEN 99 
            ELSE 0 
        END) - SUM(p.amount) AS balance,
        -- Determine the payment status (for example, based on payment completion)
        CASE 
            WHEN SUM(p.amount) >= (CASE 
                WHEN s.subscription_type = 'monthly' THEN 10 
                WHEN s.subscription_type = 'annual' THEN 99 
                ELSE 0 
            END) THEN 'Completed'
            ELSE 'Pending'
        END AS status
    FROM 
        user u
    LEFT JOIN 
        subscription s ON u.subscription_id = s.subscription_id
    LEFT JOIN 
        payment p ON s.subscription_id = p.subscription_id
    WHERE 
        u.role = 'user'
    GROUP BY 
        u.user_id, u.first_name, u.last_name, s.subscription_type
)
SELECT 
    ps.id,
    ps.memberName,
    ps.subscription_type,
    ps.amountPaid,
    ps.paymentDate,
    ps.paymentMethod,
    ps.balance,
    ps.status,
    COUNT(*) OVER() AS totalCount -- Total number of records for pagination
FROM 
    payment_summary ps
ORDER BY 
    ps.id -- Ensure consistent ordering
LIMIT 10 OFFSET 0; -- Adjust LIMIT and OFFSET for pagination

    `
    pool
        .execute(query)
        .then(([rows]) => {
            result(null, rows);
        })
        .catch((err) => {
            console.error("Error retrieving payments: ", err);
            result(err, null);
        });
    
}


Accountant.adjustPayment = (paymentId, adjustment, result) => {
    pool
        .execute("UPDATE payment SET amount = amount + ? WHERE payment_id = ?;", [adjustment, paymentId])
        .then(([rows]) => {
            result(null, rows);
        })
        .catch((err) => {
            console.error("Error: ", err);
            result(err, null);
        });
}

Accountant.getMemberInfo = (memberId, result) => {
    pool
        .execute("SELECT * FROM members WHERE member_id = ?;", [memberId])
        .then(([rows]) => {
            result(null, rows);
        })
        .catch((err) => {
            console.error("Error: ", err);
            result(err, null);
        });
}

module.exports = Accountant;