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

    const res = await signIn("credentials", {
      email: email.current,
      password: password.current,
      redirect: false,
    });

    if (res?.error === "CredentialsSignin") {
      setError("Invalid email or password. Please try again.");
    } else if (res?.error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", res.error);
    } 
  };

  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  if (isResetPassword) {
    return <ForgotPasswordForm onBack={() => setIsResetPassword(false)} />;
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
            {error && (
        <div className="flex flex-row gap-x-2 items-center p-3 text-sm text-red-500 bg-red-50 rounded-md font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>

          {error}
        </div>
      )}

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
