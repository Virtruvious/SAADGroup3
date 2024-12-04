import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

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

// helper function to format category name
const formatCategoryName = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CategoryPage: React.FC = () => {
  const router = useRouter()
  const { category } = router.query
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      if (!category) return;

      setLoading(true)
      setError(null)

      try {
        // Determine which API endpoint to call based on the category
        let endpoint = '';
        switch(category) {
          case 'new-arrivals':
            endpoint = `${API_BASE_URL}/books/newBooks`;
            break;
          case 'featured-books':
            endpoint = `${API_BASE_URL}/books/random`;
            break;
          case 'recently-viewed':
            endpoint = `${API_BASE_URL}/books/random`;
            break;
          default:
            endpoint = `${API_BASE_URL}/books/random`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch books');
        }

        setBooks(data.books);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching books');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Category Title */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center">
            {category ? formatCategoryName(category.toString()) : 'Loading...'}
          </h1>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg text-muted-foreground">Loading books...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {books.map((book) => (
              <Link href={`/book/${book.media_id}`} key={book.media_id} className="group">
                <div className="space-y-3">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm font-medium leading-none group-hover:text-primary">
                      {book.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {book.author}
                    </p>
                    <p className="text-sm font-semibold">
                      £{book.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage