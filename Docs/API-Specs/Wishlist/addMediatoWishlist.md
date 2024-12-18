
**Endpoint**: POST /wishlist/addMedia?ID=29
**Description**: Add a piece of media into a user's wishlist.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `ID` (type: Int, required): A book ID to add to the users wishlist.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Media added to wishlist"
}
``
