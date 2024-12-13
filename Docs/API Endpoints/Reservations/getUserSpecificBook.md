
**Endpoint**: GET /books/userSpecificInfo/:bookId
**Description**: Get user-specific information, such as if they have reserved, borrowed or wishlisted the book.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `bookId` (type: Int, required): A book ID to get the user information from.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "wishlist": false,
  "reservation": true,
  "borrow": false
}
``
