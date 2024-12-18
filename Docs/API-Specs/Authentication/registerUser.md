
**Endpoint**: POST /auth/register  
**Description**: Creates a new user in the system.

**Headers**:

- `Authorization`: None
- `Content-Type`: application/json

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "John.Doe@email.com",
  "postcode": "DN5 8AS",
  "houseNo": "3",
  "phone": "07500 123456",
  "role": "user",
  "password": "password123",
  "subscriptionType": "monthly",
  "paymentAmount": 10
}
```

***Response***:

- Status: 201 Created
- Body:

```json
{
  "message": "User Created Successfully (id: 30)"
}
``
