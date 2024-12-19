import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffHeader from "@/components/Staff-Header";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Wait for session to load
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/staff/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SidebarProvider>
        <div className="flex flex-grow">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-grow">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StaffLayout;