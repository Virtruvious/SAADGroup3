import * as React from "react";
import {
  BookOpen,
  Command,
  Home,
  CreditCard,
  FileText,
  Wallet,
  Settings2,
  ShoppingCart,
  Truck,
  ClipboardList,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // Default user structure
  const user = {
    name: session?.user?.firstName || "Guest",
    email: session?.user?.email || "guest@example.com",
    role: session?.user?.role || "guest",
  };

  // Navigation data based on user role
  const navData = {
    accountant: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
        isActive: true,
      },
      {
        title: "AML Accountant",
        url: "",
        icon: CreditCard,
        items: [
          { title: "Subscription Management", url: "/staff/ManageMemberships", icon: CreditCard },
          { title: "Payment Reconciliation", url: "/staff/Payment-reconciliation", icon: Wallet },
          { title: "Financial Reports", url: "/staff/Reports", icon: FileText },
          { title: "Payment History", url: "/staff/PaymentHistory", icon: Settings2 },
        ],
      },
    ],
    purchase_manager: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
        isActive: true,
      },
      {
        title: "Purchase Manager",
        url: "#",
        icon: ShoppingCart,
        items: [
          { title: "Create Purchase Order", url: "http://localhost:3000/staff/CreateOrder", icon: ClipboardList },
          { title: "Track Orders", url: "http://localhost:3000/staff/Tracking", icon: Truck },
        ],
      },
    ],
    admin: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
        isActive: true,
      },
      {
        title: "AML Admin",
        url: "#",
        icon: Command,
        items: [
          { title: "Generate System Reports", url: "http://localhost:3000/staff/systemReports", icon: ClipboardList },
          { title: "Monitor Performance", url: "http://localhost:3000/staff/monitorPerformance", icon: Truck },
          { title: "Manage Permissions", url: "http://localhost:3000/staff/ManagePermissions", icon: BookOpen },
        ],
      },
    ],
    guest: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
        isActive: true,
      },
    ],
  };

  const navMain = navData[user.role] || navData.guest;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AML</span>
                  <span className="truncate text-xs">
                    Advanced Media Library
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
