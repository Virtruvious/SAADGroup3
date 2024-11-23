"use client";
import { signIn } from "next-auth/react";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export const Login = () => {
  const email = useRef("");
  const password = useRef("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.current || !password.current) {
      return;
    }

    await signIn("credentials", {
      email: email.current,
      password: password.current,
    });
  };

  const searchParams = useSearchParams();
  const errors = searchParams ? searchParams.get("error") || "" : "";

  if (isResetPassword) {
    return <ForgotPasswordForm onBack={() => setIsResetPassword(false)} />;
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => {
            email.current = e.target.value;
          }}
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          onChange={(e) => {
            password.current = e.target.value;
          }}
        />
      </div>
      <div className="text-right">
        <Button
          type="button"
          variant="link"
          onClick={() => setIsResetPassword(true)}
        >
          Forgot Password?
        </Button>
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

const ForgotPasswordForm = ({ onBack }: any) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // password reset logic here
    console.log("Reset password for:", email);
    // we can add an extension to this form to show a success message
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reset-email" className="block mb-2 text-sm font-medium">
          Email Address
        </label>
        <Input
          id="reset-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          Back to Login
        </Button>
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </div>
    </form>
  );
};
