
**Endpoint**: GET /wishlist/getWishlist
**Description**: Get a user's full wishlist.

**Headers**:

- `Authorization`: Bearer [token] (user token, required)
- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
[
  {
    "wishlist_id": 61,
    "title": "Beloved",
    "image": "https://cdn.waterstones.com/bookjackets/large/9780/0997/9780099760115.jpg",
    "media_id": 61
  },
  {
    "wishlist_id": 62,
    "title": "Project Hail Mary",
    "image": "https://cdn.waterstones.com/bookjackets/large/9781/5291/9781529157468.jpg",
    "media_id": 58
  },
  {
    "wishlist_id": 63,
    "title": "The Lord of the Rings: The Fellowship of the Ring",
    "image": "https://cdn.waterstones.com/bookjackets/large/9780/0085/9780008567125.jpg",
    "media_id": 62
  },
  {
    "wishlist_id": 64,
    "title": "The Martian",
    "image": "https://cdn.waterstones.com/bookjackets/large/9780/0919/9780091956141.jpg",
    "media_id": 57
  }
]
``
