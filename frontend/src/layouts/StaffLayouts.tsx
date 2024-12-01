import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="flex-grow">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default StaffLayout;