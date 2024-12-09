import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/Search-Bar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ReceiptText,
  Sparkles,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { X } from "lucide-react";

interface Notification {
  notification_id: number;
  message: string;
  date: string;
  read: boolean;
}
import { Toast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:8000";

const AuthenticatedHeader = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)

  const displayName = session?.user?.firstName
    ? `${session.user.firstName} ${session.user.lastName}`
    : session?.user?.name ?? session?.user?.email ?? "User";

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/notifications`, {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          });
          
          const data = await response.json();
          const newNotifications = data.notifications || [];
          
          // only show toast if there are new unread notifications and this isn't the first load
          if (notifications.length > 0 && // check if it's not the first load
              newNotifications.some(newNotif => 
                !notifications.find(oldNotif => 
                  oldNotif.notification_id === newNotif.notification_id
                ) && !newNotif.read
              )) {
            setToastMessage({
              message: "You have received a new notification", 
              type: "info"
            });
          }
          
          setNotifications(newNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
        }
      };
    
      if (session?.jwt) {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); //30 seconds
        return () => clearInterval(interval);
      }
    }, [session]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/notifications/${notificationId}/markRead`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.notification_id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );

      if (response.ok) {
        setToastMessage({ message: "Notification deleted", type: "success" });
        setNotifications(
          notifications.filter(
            (notification) => notification.notification_id !== notificationId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <a className="flex items-center space-x-4" href="../">
            <p className="font-bold text-3xl">AML System</p>
          </a>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Help</Button>

            <DropdownMenu
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.notification_id}
                      className={`p-3 border-b last:border-b-0 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between w-full">
                        <div
                          className="flex flex-col flex-grow cursor-pointer"
                          onClick={() =>
                            !notification.read &&
                            markAsRead(notification.notification_id)
                          }
                        >
                          <span className="text-sm">
                            {notification.message}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.notification_id);
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {displayName} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="../Account" className="flex flex-row">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="../Orders" className="flex flex-row">
                    <ReceiptText className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="../WishList" className="flex flex-row">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Wish List
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" color="#Ff0000" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center space-x-4">
            <SearchBar />
          </div>
        </div>

        <nav className="border-t">
          <ul className="flex space-x-8 py-4 overflow-x-auto">
            {[
              "Browse the Library",
              "Services",
              "Research",
              "Spaces",
              "Contact Us",
              "Events",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {toastMessage && (
          <Toast
            message={toastMessage.message}
            onClose={() => setToastMessage(null)}
            type={toastMessage.type}
          />
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
