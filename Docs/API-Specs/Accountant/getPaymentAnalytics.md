
**Endpoint**: GET /accountant/payments/analytics
**Description**: Get all payment analytics.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
{
  "total_payments": 120,
  "matched_payments": 95,
  "underpaid": 15,
  "overpaid": 10,
  "total_amount": 8500.00,
  "avg_payment_delay": 5.6
}

``
