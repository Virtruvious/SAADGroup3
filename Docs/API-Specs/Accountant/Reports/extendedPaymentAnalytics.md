
**Endpoint**: GET /accountant/payments/extendedAnalytics?timeFrame=today
**Description**: Get extended account analytics for the report.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `timeframe` (type: string, required): 'all', 'month'... timeframe to gather data for.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "total_payments": 25,
  "matched_payments": 18,
  "underpaid": 5,
  "overpaid": 2,
  "total_amount": 2750.00,
  "avg_payment_delay": 4.2
}
``
