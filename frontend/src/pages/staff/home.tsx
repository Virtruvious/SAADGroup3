import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StaffNavbar from "@/components/StaffNavBar";

const Staff: React.FC = () => {
  return (
    <div className="flex">
      <StaffNavbar />
      <main className="flex-1">
        <section className="border-b bg-muted/50 w-full">
          <div className="py-16 max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold">Staff Dashboard</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/staff/manage-memberships" className="w-full">
              <Button className="w-full text-xl py-8">Manage Memberships</Button>
            </Link>
            <Link href="/staff/reports" className="w-full">
              <Button className="w-full text-xl py-8">Reports</Button>
            </Link>
            <Link href="/staff/manage-purchases" className="w-full">
              <Button className="w-full text-xl py-8">Manage Purchases</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Staff;

