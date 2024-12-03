import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Toast } from "@/components/ui/toast";

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
  image: string;
}
const API_BASE_URL = "http://localhost:8000";

const BookDetail: React.FC = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBookInfo, setUserBookInfo] = useState({
    isBookInWishlist: false,
    isBookReserved: false,
    isBookBorrowed: false,
  });
  const { data: session, status } = useSession();
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (status === "loading" || !router.isReady) return;

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();
        // Access the first item in the 'book' array
        setBookDetails(data.book[0] || null);

        // If logged in, check if the book is in the user's wishlist, borrow list, or reserve list
        if (session) {
          const userSpecificResponse = await fetch(
            `${API_BASE_URL}/books/userSpecificInfo/${bookId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                Authorization: `Bearer ${session.jwt}`,
              },
            }
          );

          if (!userSpecificResponse.ok) {
            throw new Error("Failed to fetch user-specific book info");
          }

          const userSpecificData = await userSpecificResponse.json();
          setUserBookInfo({
            isBookInWishlist: userSpecificData.wishlist,
            isBookReserved: userSpecificData.reservation,
            isBookBorrowed: userSpecificData.borrow,
          });
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

    if (!userBookInfo.isBookInWishlist) {
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
        setUserBookInfo({ ...userBookInfo, isBookInWishlist: true });
        setToastMessage("Book added to wishlist");
        setToastKey((prevKey) => prevKey + 1);
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
        setUserBookInfo({ ...userBookInfo, isBookInWishlist: false });
        setToastMessage("Book removed from wishlist");
        setToastKey((prevKey) => prevKey + 1);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error removing book from wishlist:", error);
      }
    }
  };

  const reservationHandler = async () => {
    if (!session) return;

    if (!userBookInfo.isBookReserved) {
      try {
        // console.log("Reserving book:", bookId);
        const response = await fetch(
          `${API_BASE_URL}/books/reserve/${bookId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        setUserBookInfo({ ...userBookInfo, isBookReserved: true });
        setToastMessage("Book reserved");
        setToastKey((prevKey) => prevKey + 1);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error reserving book:", error);
      }
    } else {
      try {
        // console.log("Unreserving book:", bookId);
        const response = await fetch(
          `${API_BASE_URL}/books/cancelReservation/${bookId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        setUserBookInfo({ ...userBookInfo, isBookReserved: false });
        setToastMessage("Book reservation cancelled");
        setToastKey((prevKey) => prevKey + 1);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error cancelling book reservation:", error);
      }
    }
  };

  const borrowHandler = async () => {
    if (!session) return;

    if (!userBookInfo.isBookBorrowed) {
      try {
        // console.log("Borrowing book:", bookId);
        const response = await fetch(`${API_BASE_URL}/books/borrow/${bookId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // @ts-ignore
            Authorization: `Bearer ${session.jwt}`,
          },
        });
        setUserBookInfo({ ...userBookInfo, isBookBorrowed: true });
        setToastMessage("Book borrowed");
        setToastKey((prevKey) => prevKey + 1);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error borrowing book:", error);
      }
    } else {
      try {
        // console.log("Returning book:", bookId);
        const response = await fetch(
          `${API_BASE_URL}/books/cancelBorrow/${bookId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        setUserBookInfo({ ...userBookInfo, isBookBorrowed: false });
        setToastMessage("Book returned");
        setToastKey((prevKey) => prevKey + 1);
        // console.log("Response status:", response.status);
      } catch (error) {
        console.error("Error returning book:", error);
      }
    }
  };

  const toggleImagePopup = () => {
    setShowImagePopup(!showImagePopup);
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
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="relative w-full max-w-[400px] aspect-[2/3] overflow-hidden rounded-lg shadow-md group">
            <img
              src={bookDetails.image}
              alt="Project Hail Mary (Paperback)"
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
              <button
                className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                onClick={toggleImagePopup}
              >
                Preview
              </button>
            </div>
          </div>

          {/* right column - details */}
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
                onClick={() => borrowHandler()}
                disabled={session ? false : true}
              >
                {userBookInfo.isBookBorrowed ? "Return" : "Borrow"}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => reservationHandler()}
                disabled={session ? false : true}
              >
                {userBookInfo.isBookReserved ? "Cancel Reservation" : "Reserve"}
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => wishListHandler()}
                disabled={session ? false : true}
              >
                {userBookInfo.isBookInWishlist ? "Unwishlist" : "Wishlist"}
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

      {/* Image Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-[90%] max-h-[90%] overflow-auto">
            <img
              src={bookDetails.image}
              alt="Project Hail Mary (Paperback)"
              className="w-full h-auto"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={toggleImagePopup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {toastMessage && (
        <Toast
          key={toastKey}
          message={toastMessage}
          onClose={() => setToastMessage("")}
          duration={3000}
        />
      )}
    </div>
  );
};

export default BookDetail;
