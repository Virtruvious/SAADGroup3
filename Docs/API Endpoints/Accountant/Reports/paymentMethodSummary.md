
**Endpoint**: GET /accountant/payments/methods?timeFrame=today
**Description**: Get all payment methods from specified timeframe.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `timeframe` (type: string, required): 'all', 'month'... timeframe to gather data for.

***Response***:

- Status: 200 OK
- Body:

```json
[
  {
    "payment_method": "Credit Card",
    "total_transactions": 15,
    "total_amount": 1500.00
  },
  {
    "payment_method": "PayPal",
    "total_transactions": 8,
    "total_amount": 720.00
  },
  {
    "payment_method": "Bank Transfer",
    "total_transactions": 5,
    "total_amount": 600.00
  }
]
``
