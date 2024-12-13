
**Endpoint**: POST /books/borrow/:bookId
**Description**: Borrow a piece of media.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `bookId` (type: Int, required): A book ID to borrow.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Book Borrow Requested (ID: 24)"
}
``
