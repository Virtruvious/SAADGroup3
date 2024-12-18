
**Endpoint**: POST /auth/staff/login  
**Description**: Logs a staff member into the system.

**Headers**:

- `Authorization`: None
- `Content-Type`: application/json

**Request Body**:

```json
{
  "email": "john.doeAC@aml.com",
  "password": "password123"
}
```

***Response***:

- Status: 200 OK
- Body:

```json
{
  "user": {
    "id": 26,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doeAC@aml.com",
    "role": "staff",
    "subscription": {}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoiam9obi5kb2VBQ0BnbWFpbC5jb20iLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MzQxMTU5MzUsImV4cCI6MTczNDExNzczNX0.NpBv8lHqx0Xt2CmmMVBrXSlezjNj0KhhvQczYTntp0Y"
}
``
