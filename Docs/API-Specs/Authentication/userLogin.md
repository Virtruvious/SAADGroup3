
**Endpoint**: POST /auth/login  
**Description**: Logs a user into the system.

**Headers**:

- `Authorization`: None
- `Content-Type`: application/json

**Request Body**:

```json
{
  "email": "John.Doe@email.com",
  "password": "password123"
}
```

***Response***:

- Status: 200 OK
- Body:

```json
{
  "user": {
    "id": 31,
    "firstName": "John",
    "lastName": "Doe",
    "email": "John.Doe@email.com",
    "role": "user",
    "subscription": {
      "type": "monthly",
      "start_date": "2024-12-13T00:00:00.000Z",
      "end_date": "2025-01-13T00:00:00.000Z",
      "price": "10.00",
      "duration": 1,
      "billing_frequency": "monthly"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiSm9obi5Eb2VAZW1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzQxMTU1OTAsImV4cCI6MTczNDExNzM5MH0.428BjUrBXtjRpHk76NACaP9fWEAJQMhJaVvJORN0dLs"
}
``
