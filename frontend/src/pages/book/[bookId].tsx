import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface BookDetails {
  media_id: number;
  title: string;
  author: string;
  price: string;
  tagline?: string;
  quote?: string;
  description?: string;
  publication_year: string;
  availability: number;
  media_type: string;
}
const API_BASE_URL = "http://localhost:8000";

const BookDetail: React.FC = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isbookInWishlist, setIsBookInWishlist] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || !router.isReady) return;

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();
        // Access the first item in the 'book' array
        setBookDetails(data.book[0] || null);

        // If logged in, check if the book is in the user's wishlist
        if (session) {
          const response = await fetch(`${API_BASE_URL}/wishlist/getWishlist`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch wishlist");
          }

          const data = await response.json();
          const numericBookId = Number(bookId);
          const isBookInWishlist = data.some(
            (item: any) => item.media_id === numericBookId
          );
          setIsBookInWishlist(isBookInWishlist);

          // console.log("Is book in wishlist:", isBookInWishlist);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError(error as any);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [router.isReady, bookId, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading book details...</p>
      </div>
    );
  }

  if (error || !bookDetails) {
    console.log("Error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error || "Book not found"}</p>
      </div>
    );
  }

  const wishListHandler = async () => {
    if (!session) return;

    if (!isbookInWishlist) {
      try {
        // console.log("Wishing book:", bookId);
        const response = await fetch(
          `${API_BASE_URL}/wishlist/addMedia?ID=${bookId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        setIsBookInWishlist(true)
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error adding book to wishlist:", error);
      }
    } else {
      try {
        // console.log("Unwishing book:", bookId);
        const response = await fetch(
          `${API_BASE_URL}/wishlist/removeMedia?ID=${bookId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        setIsBookInWishlist(false);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error removing book from wishlist:", error);
      }
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                  Home
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/all" className="text-blue-500 hover:text-blue-600">
                  All
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-500">{bookDetails.title}</li>
            </ol>
          </nav>
        </div>

        {/* Book Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
            {/* <Image
              src={bookData.image}
              alt={bookData.title}
              fill
              className="object-cover"
              priority
            /> */}
          </div>

          {/* right coulnm - details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{bookDetails.title}</h1>
            <p className="text-2xl font-semibold text-blue-600">
              £{bookDetails.price}
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600">
                {bookDetails.tagline}
              </h2>
              <p className="text-lg italic">{bookDetails.quote}</p>
              <p>{bookDetails.description}</p>

              <div className="space-y-2">
                <p>
                  <strong>Publication Date:</strong>{" "}
                  {new Date(bookDetails.publication_year).getFullYear()}
                </p>
                <p>
                  <strong>Author:</strong> {bookDetails.author}
                </p>
                {/* <p>{bookData.additionalInfo}</p> */}
              </div>
            </div>

            {/* action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                className="flex-1"
                onClick={() => alert("Borrow functionality to be implemented")}
                disabled={session ? false : true}
              >
                Borrow
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => alert("Reserve functionality to be implemented")}
                disabled={session ? false : true}
              >
                Reserve
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => wishListHandler()}
                disabled={session ? false : true}
              >
                {isbookInWishlist ? "Unwishlist" : "Wishlist"}
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() =>
                  alert("Add to Cart functionality to be implemented")
                }
                disabled={session ? false : true}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
