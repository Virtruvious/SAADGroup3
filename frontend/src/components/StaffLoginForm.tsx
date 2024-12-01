"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { signIn } from "next-auth/react";

export default function StaffLoginForm() {
  const email = useRef("");
  const password = useRef("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.current || !password.current) {
      return;
    }

    // sign in using 'staff-credentials' provider from [...nextauth].ts
    const res = await signIn("staff-credentials", {
      email: email.current,
      password: password.current,
      redirect: false,
    });

    
    if (res?.error === "CredentialsSignin") {
      setError("Invalid email or password. Please try again.");
    } else if (res?.error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", res.error);
    } else if (res?.ok) {
      router.push("/staff/ManageMemberships"); // change this to /staff/home, if you wanna see the other changes i made with james pages
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => { email.current = e.target.value }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          onChange={(e) => { password.current = e.target.value }}
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        Log In
      </Button>
      
      <div className="text-center mt-2">
        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
      </div>
    </form>
  );
}
