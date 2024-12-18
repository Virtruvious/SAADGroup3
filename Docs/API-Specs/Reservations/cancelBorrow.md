
**Endpoint**: POST /books/cancelBorrow/:mediaId
**Description**: Cancel a media borrow request.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `mediaId` (type: Int, required): A media ID to cancel their borrow request of.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Borrow Cancelled (ID: 24)"
}
``
