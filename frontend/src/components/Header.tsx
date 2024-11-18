import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Search } from 'lucide-react'
import Link from "next/link"

const Header: React.FC = () => {
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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Login/Register</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4">
                      <p>Login/Register options here</p>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
            {["Browse the Library", "Services", "Research", "Spaces", "Contact Us", "Events"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header