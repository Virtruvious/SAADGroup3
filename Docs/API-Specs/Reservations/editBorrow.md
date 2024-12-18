
**Endpoint**: POST /books/editBorrow/:borrowId
**Description**: STAFF Endpoint, edit the current status of a borrow request.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `borrowId` (type: Int, required): A borrowing request ID to modify the status of.

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
  "message": "Borrow Edited (ID: 3)"
}
``
