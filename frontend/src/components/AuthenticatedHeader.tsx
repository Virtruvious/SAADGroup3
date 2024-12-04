import React from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const AuthenticatedHeader = () => {
  const { data: session } = useSession();

  const displayName = session?.user?.firstName
    ? `${session.user.firstName} ${session.user.lastName}`
    : session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <a className="flex items-center space-x-4" href="../">
            <p className="font-bold text-3xl">AML System</p>
          </a>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Help</Button>
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
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
