
**Endpoint**: GET /accountant/reports/export?type=revenue&timeFrame=month
**Description**: Generate a report for a given type.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `type` (type: string, required): 'revenue', 'reconciliation', 'methods' type to generate report for.
- `timeframe` (type: string, required): 'all', 'month'... timeframe to gather data for.

***Response***:

- Status: 200 OK
- Body:

```json
[
  {
    "payment_date": "2024-06-17",
    "member_name": "John Smith",
    "amount": 100.00,
    "payment_method": "Credit Card",
    "subscription_type": "Annual"
  },
  {
    "payment_date": "2024-06-17",
    "member_name": "Jane Doe",
    "amount": 50.00,
    "payment_method": "PayPal",
    "subscription_type": "Monthly"
  },
  {
    "payment_date": "2024-06-17",
    "member_name": "Alice Johnson",
    "amount": 75.00,
    "payment_method": "Bank Transfer",
    "subscription_type": "Monthly"
  },
  {
    "payment_date": "2024-06-17",
    "member_name": "Michael Brown",
    "amount": 200.00,
    "payment_method": "Credit Card",
    "subscription_type": "Annual"
  }
]
``
