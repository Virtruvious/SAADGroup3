
**Endpoint**: POST /books/reserve/:bookId
**Description**: Reserve a piece of media.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `bookId` (type: Int, required): A book ID to reserve.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Book Reserversation Requested (ID: 4)"
}
``
