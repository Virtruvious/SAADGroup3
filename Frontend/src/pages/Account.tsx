
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Account: React.FC = () => {
  return (
    <>
      <section className="border-b bg-muted/50 w-full flex justify-center items-center">
        <div className="py-16">
             <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold">Manage Account</h1>
            </div>
         </div>
        </section>


      <section className="flex flex-wrap justify-center gap-8 py-8 ">
        <form className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">User Credentials</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input type="text" name="Fname" placeholder="Enter first name" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input type="text" name="Sname" placeholder="Enter last name" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" name="Email" placeholder="Enter email" />
          </div>
          <Button type="submit">Submit</Button>
        </form>

        
        <form className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Update Account</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter Address</label>
            <Input type="text" name="Address" placeholder="Enter address" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter House Number</label>
            <Input type="text" name="Hnumber" placeholder="Enter house number" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter Postcode</label>
            <Input type="text" name="Pcode" placeholder="Enter postcode" />
          </div>
          <Button type="submit">Submit</Button>
        </form>

        <form className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Update Password</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter Old Password</label>
            <Input
              type="password"
              name="OldPassword"
              placeholder="Enter old password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter New Password</label>
            <Input
              type="password"
              name="NewPassword"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confirm Password Change
            </label>
            <Input
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm new password"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </section>

      <section className="py-8 flex justify-center">
        <form className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Update Membership</h2>
          <div className="flex justify-between mb-4">
            <Button>Daily</Button>
            <Button>Monthly</Button>
            <Button>Yearly</Button>
          </div>
          <div className = "flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
          
        </form>
      </section>
    </>
  );
};

export default Account;
