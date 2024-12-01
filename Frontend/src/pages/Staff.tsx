import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Staff: React.FC = () => {
  return (
    <>
      <section className="border-b bg-muted/50 w-full flex justify-center items-center">
        <div className="py-16">
             <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold">Manage Account</h1>
            </div>
         </div>
        </section>

        <section className="py-8 flex justify-center">
        <form>
        <Link href="../ManageMemberships">
            <Button className="text-2xl px-10 py-5">Manage Memberships</Button>
        </Link>
          
        </form>
      </section>

      <section className="py-8 flex justify-center">
        <form>
        <Link href="../Reports">
            <Button className="text-2xl px-10 py-5">Reports</Button>
        </Link>
          
        </form>
      </section>

      <section className="py-8 flex justify-center">
      <form>
        <Link href="../ManagePurchases">
            <Button className="text-2xl px-10 py-5">Manage Purchases</Button>
        </Link>
      </form>
    </section>
          
    </>
  );
};

export default Staff;
