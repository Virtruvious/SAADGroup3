import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Search,
  Check,
  Clock,
  CalendarRange,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Login } from "./Login";
import { Register } from "./Register";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

const Header = () => {
  const { status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>; // or any other loading state
  }

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <a className="flex items-center space-x-4" href="../">
              <p className="font-bold text-3xl">AML System</p>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Help</Button>
            <Button onClick={() => setIsModalOpen(true)}>
              Login / Register
            </Button>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Access</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <Login />
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <Register />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
