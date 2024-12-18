
**Endpoint**: GET /accountant/payments/outstanding
**Description**: Get a list of outstanding balances per member.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
[
  {
    "memberName": "John Smith",
    "subscription_type": "annual",
    "balance": 80.00,
    "last_payment_date": "2024-06-10"
  },
  {
    "memberName": "Jane Doe",
    "subscription_type": "annual",
    "balance": 75.00,
    "last_payment_date": "2024-05-28"
  },
  {
    "memberName": "Alice Johnson",
    "subscription_type": "monthly",
    "balance": 50.00,
    "last_payment_date": "2024-06-01"
  }
]
``
