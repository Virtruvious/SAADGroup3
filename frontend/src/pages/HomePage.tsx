import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Book } from "lucide-react";

interface BookType {
    media_id: number;
    title: string;
    author: string;
    media_type: string;
    publication_year: string;
    availability: number;
    price: string;
    image: string;
}

const API_BASE_URL = "http://localhost:8000";

const Homepage: React.FC = () => {
  const [newBooks, setNewBooks] = useState<BookType[]>([]);
  const [randomBooks, setRandomBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [newBooksRes, randomBooksRes] = await Promise.all([
          fetch(`${API_BASE_URL}/books/newBooks`),
          fetch(`${API_BASE_URL}/books/random`),
        ]);

        const newBooksData = await newBooksRes.json();
        const randomBooksData = await randomBooksRes.json();

        setNewBooks(newBooksData.books);
        setRandomBooks(randomBooksData.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const BookSection = ({
    title,
    books,
  }: {
    title: string;
    books: BookType[];
  }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {books.map((book, index) => {
          const bookId = book.media_id;
          return (
            <Link
              href={`/book/${bookId}`}
              key={bookId || index}
              className="flex-none"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="w-full h-32 bg-muted rounded flex items-center justify-center mb-2">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  </div>
                  <CardTitle className="text-sm line-clamp-2">
                    {book.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Published: {new Date(book.publication_year).getFullYear()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/50 w-full">
        <div className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Our Library</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Discover millions of resources at your fingertips. Our advanced
              library management system makes it easier than ever to explore,
              learn, and grow.
            </p>
            <Link href="/catalog">
              <Button>Browse Catalog</Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading books...</p>
          </div>
        ) : (
          <>
            <BookSection title="Latest Releases" books={newBooks} />
            <BookSection title="Discover Something New" books={randomBooks} />
          </>
        )}
      </main>

      <section className="border-y bg-muted/50 w-full">
        <div className="container mx-auto py-12">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-16 w-16 rounded-full bg-muted"
                aria-label={`Partner logo ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Sign up for newsletter</h2>
          <div className="flex space-x-2">
            <Input type="email" placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
