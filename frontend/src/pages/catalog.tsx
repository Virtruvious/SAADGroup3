import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from 'react'

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

const ScrollableList = ({ title, books }: {
    title: string,
    books: BookType[],
}) => (
    <section className="py-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <Link
                    href={`/category/${encodeURIComponent(title.toLowerCase().replace(' ', '-'))}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View More
                </Link>
        </div>
        <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {books.map((book) => (
                    <Link href={`/book/${book.media_id}`} key={book.media_id} className="flex-none">
                        <div className="w-[150px] space-y-3">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={150}
                                    height={200}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">{book.title}</div>
                                <div className="text-xs text-gray-500">{book.author}</div>
                                <div className="text-sm font-semibold">{book.price}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-background p-2 shadow-lg"
                aria-label="Scroll right"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    </section>
)

const CatalogPage: React.FC = () => {
    const [newBooks, setNewBooks] = useState<BookType[]>([]);
    const [randomBooks, setRandomBooks] = useState<BookType[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<BookType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const [newBooksRes, randomBooksRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/books/newBooks?limit=10`),
                    fetch(`${API_BASE_URL}/books/random`),
                ]);

                const newBooksData = await newBooksRes.json();
                const randomBooksData = await randomBooksRes.json();

                setNewBooks(newBooksData.books);
                setRandomBooks(randomBooksData.books);
                
                // You might want to get recently viewed books from localStorage or another API endpoint
                // This is just a placeholder using random books for demonstration
                setRecentlyViewed(randomBooksData.books.slice(0, 5));
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <ScrollableList
                title="New Arrivals"
                books={newBooks}
            />
            <ScrollableList
                title="Featured Books"
                books={randomBooks}
            />
            <ScrollableList
                title="Recently Viewed"
                books={recentlyViewed}
            />
        </div>
    )
}

export default CatalogPage