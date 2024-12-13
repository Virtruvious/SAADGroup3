
**Endpoint**: POST /books/editReservation/:reservationId
**Description**: STAFF Endpoint, edit the current status of a reservation request.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `reservationId` (type: Int, required): A reservation request ID to modify the status of.

**Request Body**:

```json
{
  "newStatus": "pending"
}
```

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Reservation Edited (ID: 3)"
}
``
