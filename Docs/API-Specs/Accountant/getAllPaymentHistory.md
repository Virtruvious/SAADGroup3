
**Endpoint**: GET /accountant/payments/history
**Description**: Get all payment history.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
{
  "history": 
    [
        {
            "payment_id": 9,
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
        {
            "payment_id": 8,
            "amount": 50.00,
            "payment_date": "2024-05-20",
            "payment_method": "PayPal",
            "status": 1,
            "subscription_id": 555,
            "original_amount": 50.00,
            "reconciliation_status": "matched",
            "adjustment_amount": null,
            "reason": null,
            "adjustment_date": null,
            "adjusted_by": null
        },
        {
            "payment_id": 7,
            "amount": 75.00,
            "payment_date": "2024-04-10",
            "payment_method": "Bank Transfer",
            "status": 1,
            "subscription_id": 555,
            "original_amount": 75.00,
            "reconciliation_status": "underpaid",
            "adjustment_amount": -5.00,
            "reason": "Late fee waiver",
            "adjustment_date": "2024-04-15",
            "adjusted_by": "Jane Smith"
        }
    ]
}
``
