const accountant = require("../Models/accountant.model");
const jwt = require("jsonwebtoken");

async function verifyJWT(req, res) {
    try {
      console.log("Headers:", req.headers);  // Log all headers
      
      if (!req.headers.authorization) {
        console.log("No authorization header");
        res.status(401).json({ message: "No authorization header" });
        return null;
      }
  
      const JWT = req.headers.authorization.split(" ")[1];
      console.log("Extracted JWT:", JWT);  // Log the extracted token
      
      if (!JWT) {
        console.log("No token after split");
        res.status(401).json({ message: "No token provided" });
        return null;
      }
  
      console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);  // Log the secret (be careful in production!)
      
      const decoded = jwt.verify(JWT, process.env.TOKEN_SECRET);
      console.log("Decoded token:", decoded);  // Log decoded token
      return decoded.id;
    } catch (err) {
      console.error("JWT Verification error:", err);
      res.status(401).json({ message: "Invalid token", error: err.message });
      return null;
    }
  }

exports.getAllMembers = (req, res) => {
    accountant.getAllMembers((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Members" });
            console.log(err);
        } else {
            res.status(200).send({ members: data });
        }
    });
};

exports.payments = (req, res) => {
    accountant.payments((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payments" });
            console.log(err);
        } else {
            res.status(200).send({ payments: data });
        }
    });
};

exports.createPaymentAdjustment = async (req, res) => {
    const userId = await verifyJWT(req, res);
    if (!userId) return;
 
    const adjustmentData = {
        payment_id: req.body.payment_id,
        amount: req.body.amount,
        reason: req.body.reason,
        adjustedBy: userId
    };
 
    accountant.createPaymentAdjustment(adjustmentData, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error creating payment adjustment" });
            console.log(err);
        } else {
            res.status(200).send({
                message: "Payment adjustment created successfully",
                data: data
            });
        }
    });
 };

 exports.createNotification = async (req, res) => {
    const userId = await verifyJWT(req, res);
    if (!userId) return;
 
    const { message, type } = req.body;
 
    accountant.createNotification(userId, message, type, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error creating notification" });
            console.log(err);
        } else {
            res.status(200).send({ message: "Notification created successfully" });
        }
    });
 }
 
 exports.adjustPayment = async (req, res) => {
    const userId = await verifyJWT(req, res);
    if (!userId) return;
 
    const { paymentId } = req.params;
    const { adjustment, reason } = req.body;
 
    accountant.adjustPayment(paymentId, adjustment, userId, reason, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Adjusting Payment" });
        } else {
            res.status(200).send({ message: "Payment Adjusted Successfully" });
        }
    });
 };

exports.getPaymentHistory = (req, res) => {
    const { memberId } = req.params;
    accountant.getPaymentHistory(memberId, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payment History" });
            console.log(err);
        } else {
            res.status(200).send({ history: data });
        }
    });
};

exports.getAllPaymentsHistory = (req, res) => {
    accountant.getAllPaymentsHistory((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Payments History" });
            console.log(err);
        } else {
            res.status(200).send({ history: data });
        }
    });
}

exports.getPaymentAnalytics = (req, res) => {
    accountant.getPaymentAnalytics((err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Analytics" });
            console.log(err);
        } else {
            res.status(200).send({ analytics: data });
        }
    });
};

exports.getMemberInfo = (req, res) => {
    const { memberId } = req.params;
    accountant.getMemberInfo(memberId, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error Fetching Member Info" });
            console.log(err);
        } else {
            res.status(200).send({ member: data });
        }
    });
};

exports.getSubscriptionPlans = (req, res) => {
    accountant.getSubscriptionPlans((err, data) => {
      if (err) {
        res.status(500).send({ message: "Error Fetching Subscription Plans" });
        console.log(err);
      } else {
        res.status(200).send({ plans: data });
      }
    });
  };
  
  exports.changeMembershipType = async (req, res) => {
    const adjustedBy = await verifyJWT(req, res);
    if (!adjustedBy) return;
  
    const { userId } = req.params;
    const { newType, reason, currentSubscriptionId } = req.body;
  
    try {
      await accountant.changeMembershipType(userId, newType, reason, currentSubscriptionId, adjustedBy);
      res.status(200).send({ message: "Membership changed successfully" });
    } catch (err) {
      console.error("Error in changeMembershipType:", err);
      res.status(500).send({ message: "Error changing membership type", error: err.message });
    }
  };

exports.getPaymentMethodSummary = async (req, res) => {
    const { timeFrame } = req.query;
  
    accountant.getPaymentMethodSummary(timeFrame, (err, data) => {
      if (err) {
        res.status(500).send({ message: "Error fetching payment method summary" });
        console.log(err);
      } else {
        res.status(200).send({ methods: data });
      }
    });
  };
  
    exports.getExtendedAnalytics = async (req, res) => {
        const { timeFrame } = req.query;
    
        accountant.getExtendedAnalytics(timeFrame, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error fetching extended analytics" });
            console.log(err);
        } else {
            res.status(200).send({ analytics: data});
        }
        });
    };
  
  exports.getOutstandingBalances = async (req, res) => {
    accountant.getOutstandingBalances((err, data) => {
      if (err) {
        res.status(500).send({ message: "Error fetching outstanding balances" });
        console.log(err);
      } else {
        res.status(200).send({ balances: data });
      }
    });
  };
  
  exports.exportReport = async (req, res) => {
    const { type, timeFrame } = req.query;
  
    accountant.exportReport(type, timeFrame, (err, data) => {
      if (err) {
        res.status(500).send({ message: "Error generating export" });
        console.log(err);
      } else {
        const csvData = convertToCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
        res.status(200).send(csvData);
      }
    });
  };
  
  function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header] ?? '';
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }