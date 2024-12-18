
**Endpoint**: GET /accountant/members
**Description**: Get all members within the system.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
{
  "members": [
    {
      "user_id": 30,
      "first_name": "smurf1",
      "email": "The.song1@gmail.com",
      "phone": "07000 654321",
      "role": "user",
      "password": "$2b$10$GwFs55f.KwF.lrgsB4sOqOTPR0bmoG8S9t10M5nIQwGdeLGNURuva",
      "subscription_id": 23,
      "last_name": "song",
      "postcode": "D2 8AS",
      "house_number": "23",
      "subscription_type": "monthly",
      "start_date": "2024-12-13T00:00:00.000Z",
      "end_date": "2025-01-13T00:00:00.000Z",
      "status": 1,
      "plan_id": 3,
      "payment_id": 11,
      "amount": 10,
      "payment_date": "2024-12-13T00:00:00.000Z",
      "payment_method": "inhouse",
      "original_amount": "10.00",
      "reconciliation_status": "overpaid",
      "subscription_price": "10.00"
    },
    {
      "user_id": 31,
      "first_name": "John",
      "email": "John.Doe@email.com",
      "phone": "07500 123456",
      "role": "user",
      "password": "$2b$10$m2wclxZIH572E0sv4m4PeO9MpnL8r1KTrCxKex.DnRQsic23.u822",
      "subscription_id": 24,
      "last_name": "Doe",
      "postcode": "DN5 8AS",
      "house_number": "3",
      "subscription_type": "monthly",
      "start_date": "2024-12-13T00:00:00.000Z",
      "end_date": "2025-01-13T00:00:00.000Z",
      "status": 1,
      "plan_id": 3,
      "payment_id": 12,
      "amount": 10,
      "payment_date": "2024-12-13T00:00:00.000Z",
      "payment_method": "inhouse",
      "original_amount": "10.00",
      "reconciliation_status": "overpaid",
      "subscription_price": "10.00"
    }
  ]
}
``
