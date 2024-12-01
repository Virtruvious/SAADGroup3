"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Book, X } from "lucide-react";

interface WishlistItem {
  wishlist_id: number;
  title: string;
  media_id: number;
  publication_year?: string;
}

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <div
    className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {message}
  </div>
);

const WishlistPage: React.FC = () => {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/wishlist/getWishlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              "Authorization": `Bearer ${session.jwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Raw response data:", data);

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        console.log("Parsed wishlist items:", data);
        setWishlistItems(data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Unable to load wishlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [session]);

  const removeFromWishlist = async (media_id?:number) => {
    if (!session) return;

      try {
        // console.log("Unwishing book:", bookId);
        const response = await fetch(
          `http://localhost:8000/wishlist/removeMedia?ID=${media_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );
        // console.log("Response status:", response.status);
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.media_id !== media_id)
        );
      } catch (error) {
        console.error("Error removing book from wishlist:", error);
      }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Please log in to view your wishlist
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center">My Wishlist</h1>
        </div>
      </div>

      {wishlistItems.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-muted-foreground">
            Your wishlist is empty. Start adding books you'd like to read!
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {wishlistItems.map((item) => (
            <Card
              key={item.media_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-4">
                <div className="w-full h-32 bg-muted rounded flex items-center justify-center mb-2">
                  <Book className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {item.publication_year && (
                  <p className="text-sm text-muted-foreground">
                    Published: {new Date(item.publication_year).getFullYear()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Link href={`/book/${item.media_id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromWishlist(item.media_id)}
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default WishlistPage;
