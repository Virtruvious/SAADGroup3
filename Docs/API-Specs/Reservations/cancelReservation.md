
**Endpoint**: POST /books/cancelReservation/:mediaId
**Description**: Cancel a media reservation.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `mediaId` (type: Int, required): A media ID to cancel their reservation of.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Reservation Cancelled (ID: 24)"
}
``
