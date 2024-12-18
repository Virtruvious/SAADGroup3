
**Endpoint**: GET /books/search?query=lord
**Description**: Searches for books vased on query parameter.

**Headers**:

- `Authorization`: None
- `Content-Type`: application/json

**Query Parameters**:

- `query` (type: string, required): The search query to search for.


***Response***:

- Status: 200 OK
- Body:

```json
{
  "books": [
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
      "vendor_id": null,
      "relevance": 2
    },
    {
      "media_id": 64,
      "title": "The Lord of the Rings: The Return of the King",
      "author": "J.R.R. Tolkien",
      "media_type": "book",
      "publication_year": "1955-01-01T00:00:00.000Z",
      "availability": 1,
      "price": "19",
      "image": "https://cdn.waterstones.com/bookjackets/large/9780/0085/9780008567149.jpg",
      "description": "A special unjacketed hardback edition of the final part of J.R.R. Tolkien's epic masterpiece, The Lord of the Rings. This edition features the complete story with a unique cover design embellished with silver foil and the iconic maps appearing in red and black as endpapers.\r\n\r\nThe Companions of the Ring have become involved in separate adventures as the quest continues. Aragorn, revealed as the hidden heir of the ancient Kings of the West, joined with the Riders of Rohan against the forces of Isengard, and took part in the desperate victory of the Hornburg. Merry and Pippin, captured by orcs, escaped into Fangorn Forest and there encountered the Ents.\r\n\r\nGandalf returned, miraculously, and defeated the evil wizard, Saruman. Meanwhile, Sam and Frodo progressed towards Mordor to destroy the Ring, accompanied by Smeagol - Gollum, still obsessed by his 'preciouss'. After a battle with the giant spider, Shelob, Sam left his master for dead; but Frodo is still alive - in the hands of the orcs. And all the time the armies of the Dark Lord are massing.\r\n\r\nPublisher: HarperCollins Publishers\r\nISBN: 9780008567149\r\nNumber of pages: 448\r\nWeight: 540 g\r\nDimensions: 222 x 141 x 40 mm\r\nEdition: Special Collector’s edition",
      "vendor_id": null,
      "relevance": 2
    },
    {
      "media_id": 63,
      "title": "The Lord of the Rings: The Two Towers",
      "author": "J.R.R. Tolkien",
      "media_type": "book",
      "publication_year": "1954-01-01T00:00:00.000Z",
      "availability": 1,
      "price": "10",
      "image": "https://cdn.waterstones.com/bookjackets/large/9780/0085/9780008567132.jpg",
      "description": "\r\nA special unjacketed hardback edition of the second part of J.R.R. Tolkien's epic masterpiece, The Lord of the Rings. This edition features the complete story with a unique cover design embellished with copper foil and the iconic maps appearing in red and black as endpapers.\r\n\r\nFrodo and the Companions of the Ring have been beset by danger during their quest to prevent the Ruling Ring from falling into the hands of the Dark Lord by destroying it in the Cracks of Doom. They have lost the wizard, Gandalf, in the battle with an evil spirit in the Mines of Moria; and at the Falls of Rauros, Boromir, seduced by the power of the Ring, tried to seize it by force. While Frodo and Sam made their escape the rest of the company were attacked by Orcs.\r\n\r\nNow they continue their journey alone down the great River Anduin - alone, that is, save for the mysterious creeping figure that follows wherever they go.\r\n\r\nPublisher: HarperCollins Publishers\r\nISBN: 9780008567132\r\nNumber of pages: 352\r\nWeight: 440 g\r\nDimensions: 222 x 141 x 32 mm\r\nEdition: Special Collector’s edition",
      "vendor_id": null,
      "relevance": 2
    }
  ]
}
``
