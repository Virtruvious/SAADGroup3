import React, { useState } from "react";
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
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log session status and data for debugging
  useEffect(() => {
    console.log("Session status:", status); // To see status of the session
    console.log("Session data:", session); // To check session data
  }, [status, session]); // Runs every time the session or status changes

  if (status === "loading") {
    return <div>Loading...</div>; // or any other loading state
  }

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    House & Location
                  </NavigationMenuTrigger>
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
            {session ? (
              <div className="bg-black rounded-lg text-white p-2 px-2.5 font-semibold">
                {session.user?.firstName[0] + session.user?.lastName[0]}
              </div>
            ) : (
              <Button onClick={() => setIsModalOpen(true)}>
                Login / Register
              </Button>
            )}
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
