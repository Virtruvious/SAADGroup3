
**Endpoint**: GET /admin/getReport?timeframe=all
**Description**: Generates data for system report.

**Headers**:

- `Authorization`: Bearer [token] (staff token, required)
- `Content-Type`: application/json

**Query Parameters**:

- `timeframe` (type: string, required): 'all', 'month'... timeframe to gather data for.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "stats": {
    "total_active_users": 3,
    "total_books_borrowed": 17,
    "total_reserved_books": 1
  },
  "perf": {
    "uptime": 99.98,
    "response_time": 0.5,
    "newErrors": 0
  },
  "topBooks": [
    {
      "media_id": 71,
      "title": "In Cold Blood",
      "number_of_borrows": 10
    },
    {
      "media_id": 75,
      "title": "The God of Small Things",
      "number_of_borrows": 4
    },
    {
      "media_id": 58,
      "title": "Project Hail Mary",
      "number_of_borrows": 1
    },
    {
      "media_id": 60,
      "title": "A Confederacy of Dunces",
      "number_of_borrows": 1
    },
    {
      "media_id": 61,
      "title": "Beloved",
      "number_of_borrows": 1
    }
  ]
}
``
