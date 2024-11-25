import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const AuthenticatedHeader = () => {
  const { data: session } = useSession();

  const displayName = session?.user?.firstName 
    ? `${session.user.firstName} ${session.user.lastName}`
    : session?.user?.name 
    ?? session?.user?.email
    ?? "User";

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>House & Location</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4">
                      <p>Location content here</p>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
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
                <Link href="Account">
                  <User className="mr-2 h-5 w-5" />Account
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link href="Orders"> 
                  <Settings className="mr-2 h-5 w-5" />Orders
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" color="#Ff0000"/> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            </div>
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