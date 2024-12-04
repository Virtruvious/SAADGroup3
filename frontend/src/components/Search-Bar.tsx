import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/router';
import { Search } from "lucide-react";

interface BookSearchResult {
    media_id: number;
    title: string;
    author: string;
    image: string;
}

const API_BASE_URL = "http://localhost:8000";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/books/search?query=${encodeURIComponent(searchQuery)}`);
                    const data = await response.json();
                    setSearchResults(data.books);
                    setShowResults(true);
                } catch (error) {
                    console.error('Error searching books:', error);
                    setSearchResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300); 

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleResultClick = (bookId: number) => {
        router.push(`/book/${bookId}`);
        setShowResults(false);
        setSearchQuery("");
    };

    return (
        <div className="relative flex-1" ref={searchContainerRef}>
            <div className="relative">
                <Input
                    type="search"
                    placeholder="Search for books..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
                <div className="absolute z-[999] w-full mt-1 bg-background rounded-md shadow-lg border">
                    {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Searching...
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="max-h-[70vh] overflow-y-auto">
                            {searchResults.map((book) => (
                                <div
                                    key={book.media_id}
                                    className="p-2 hover:bg-muted cursor-pointer flex items-center space-x-3"
                                    onClick={() => handleResultClick(book.media_id)}
                                >
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="h-12 w-9 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{book.title}</p>
                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No results found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export { SearchBar };