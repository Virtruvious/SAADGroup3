
**Endpoint**: GET /accountant/payments/history/:payment_id
**Description**: Get payment history per payment id.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `payment_id` (type: int, required): The paymentID to get information for.


***Response***:

- Status: 200 OK
- Body:

```json
{
  "history": 
    [
        {
            "payment_id": 20,
            "amount": 100.00,
            "payment_date": "2024-06-15",
            "payment_method": "Credit Card",
            "status": 1,
            "subscription_id": 555,
            "original_amount": 100.00,
            "reconciliation_status": "matched",
            "adjustment_amount": -10.00,
            "reason": "Refund adjustment",
            "adjustment_date": "2024-06-16",
            "adjusted_by": "John Doe"
        },
    ]
}
``
