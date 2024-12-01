import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, Users, BarChart, ShoppingCart } from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { href: '/staff', label: 'Dashboard', icon: Home },
  { href: '/staff/manage-memberships', label: 'Manage Memberships', icon: Users },
  { href: '/staff/reports', label: 'Reports', icon: BarChart },
  { href: '/staff/manage-purchases', label: 'Manage Purchases', icon: ShoppingCart },
];

const StaffNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/staff/login',
      redirect: true
    });
  };

  const NavContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Staff Portal</h2>
      </div>
      <ul className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={() => setIsOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 py-2 px-4 rounded transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-200"
              )}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-2xl font-bold text-gray-800">Staff Portal</SheetTitle>
            </SheetHeader>
            <nav className="p-4 flex flex-col flex-grow">
              <NavContent />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r h-screen  left-0 top-0 p-4 shadow-md">
        <NavContent />
      </nav>
    </>
  );
};

export default StaffNavbar;