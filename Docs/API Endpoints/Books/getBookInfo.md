
**Endpoint**: GET /books/:bookId
**Description**: Searches for books vased on query parameter.

**Headers**:

- `Authorization`: None
- `Content-Type`: application/json

**Query Parameters**:

- `bookId` (type: int, required): The bookID to get information for.


***Response***:

- Status: 200 OK
- Body:

```json
{
  "book": [
    {
      "media_id": 62,
      "title": "The Lord of the Rings: The Fellowship of the Ring",
      "author": "J.R.R. Tolkien",
      "media_type": "book",
      "publication_year": "1954-01-01T00:00:00.000Z",
      "availability": 1,
      "price": "29",
      "image": "https://cdn.waterstones.com/bookjackets/large/9780/0085/9780008567125.jpg",
      "description": "Continuing the story begun in The Hobbit, this is the first part of Tolkien's epic masterpiece, The Lord of the Rings, featuring a striking black cover based on Tolkien's own design and the definitive text.\r\n\r\nSauron, the Dark Lord, has gathered to him all the Rings of Power - the means by which he intends to rule Middle-earth. All he lacks in his plans for dominion is the One Ring - the ring that rules them all - which has fallen into the hands of the hobbit, Bilbo Baggins.\r\n\r\nIn a sleepy village in the Shire, young Frodo Baggins finds himself faced with an immense task, as his elderly cousin Bilbo entrusts the Ring to his care. Frodo must leave his home and make a perilous journey across Middle-earth to the Cracks of Doom, there to destroy the Ring and foil the Dark Lord in his evil purpose.\r\n\r\nNow published again in B format, J.R.R. Tolkien's great work of imaginative fiction has been labelled both a heroic romance and a classic fantasy fiction. By turns comic and homely, epic and diabolic, the narrative moves through countless changes of scene and character in an imaginary world which is totally convincing in its detail.\r\n\r\nPublisher: HarperCollins Publishers\r\nISBN: 9780261103573\r\nNumber of pages: 448\r\nWeight: 310 g\r\nDimensions: 198 x 129 x 28 mm",
      "vendor_id": null
    }
  ]
}
``
