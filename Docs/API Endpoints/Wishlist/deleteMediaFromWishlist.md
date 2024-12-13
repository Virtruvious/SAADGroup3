
**Endpoint**: DELETE /wishlist/removeMedia?ID=29
**Description**: Remove a piece of media into a user's wishlist.

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
  "message": "Media deleted from wishlist"
}
``
