"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Check, Clock, CalendarRange } from "lucide-react";
import { signIn } from "next-auth/react";

const SubscriptionCard = ({
  type,
  price,
  savings,
  features,
  value,
  selected,
  onChange,
}: any) => (
  <Card
    className={`relative transition-all duration-200 ${
      selected === value
        ? "border-2 border-primary shadow-lg"
        : "hover:border-primary/50 hover:shadow-md"
    }`}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value} className="cursor-pointer">
            <CardTitle
              className={`text-lg ${selected === value ? "text-primary" : ""}`}
            >
              {type}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {savings}
            </CardDescription>
          </Label>
        </div>
        {type === "Annual Membership" && (
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Best Value
          </span>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1 text-sm">
            {value === "annual" ? "/year" : "/month"}
          </span>
        </div>

        <div className="space-y-2">
          {features.map((feature: any, index: any) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const SubscriptionSelection = ({ onSubscriptionSelect }: any) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value: any) => {
    setSelected(value);
    onSubscriptionSelect(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Choose your membership plan</h3>
        <p className="text-sm text-muted-foreground">
          Select the plan that works best for you. Switch or cancel anytime.
        </p>
      </div>

      <RadioGroup onValueChange={handleSelect} className="space-y-4">
        <SubscriptionCard
          type="Annual Membership"
          price="£99"
          savings="Save 20% with yearly billing"
          value="annual"
          selected={selected}
          features={[
            "Best value for money",
            "Unlimited library access",
            "Priority booking for events",
            "Special member discounts",
            "Free home delivery service",
          ]}
          icon={CalendarRange}
        />

        <SubscriptionCard
          type="Monthly Membership"
          price="£10"
          savings="Flexible monthly billing"
          value="monthly"
          selected={selected}
          features={[
            "Flexible commitment",
            "Unlimited library access",
            "Member discounts",
            "Access to all facilities",
            "Cancel anytime",
          ]}
          icon={Clock}
        />
      </RadioGroup>

      {selected && (
        <div className="pt-4">
          <Button
            onClick={() => onSubscriptionSelect(selected)}
            className="w-full"
          >
            Continue with {selected === "annual" ? "Annual" : "Monthly"} Plan
          </Button>
        </div>
      )}
    </div>
  );
};

const PersonalInfoForm = ({ selectedPlan, onBack }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      postcode: formData.get("postcode"),
      houseNo: formData.get("houseNumber"),  // Changed to match backend expectation
      password: formData.get("password"),
      role: "user",
      subscriptionType: selectedPlan
    };

    try {
      const registerResponse = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await registerResponse.json();
      console.log("Register response data:", responseData);

      if (!registerResponse.ok) {
        throw new Error(responseData.message || "Failed to register user");
      }

      // login user if registration is successful
      const loginResponse = await signIn("credentials", {
        email: userData.email,
        password: formData.get("password"),
        redirect: false,
      });

      if (loginResponse?.error) {
        throw new Error(loginResponse.error || "Failed to login after registration");
      }

      // refresh page after successful login
      window.location.reload();
      
    } catch (error: any) {
      console.error("Registration/Login error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Complete your registration</h3>
        <p className="text-sm text-muted-foreground">
          Selected plan: {selectedPlan === "annual" ? "Annual" : "Monthly"}{" "}
          Membership
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
            First Name
          </label>
          <Input id="firstName" name="firstName" type="text" placeholder="First name" required />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
            Last Name
          </label>
          <Input id="lastName" name="lastName" type="text" placeholder="Last name" required />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="Email address" required />
      </div>

      <div>
        <label htmlFor="phone" className="block mb-2 text-sm font-medium">
          Phone Number
        </label>
        <Input id="phone" name="phone" type="tel" placeholder="Phone number" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postcode" className="block mb-2 text-sm font-medium">
            Postcode
          </label>
          <Input id="postcode" name="postcode" type="text" placeholder="Postcode" required />
        </div>
        <div>
          <label htmlFor="houseNumber" className="block mb-2 text-sm font-medium">
            House Number
          </label>
          <Input
            id="houseNumber"
            name="houseNumber"
            type="text"
            placeholder="House number"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create password"
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
};

export const Register = () => {
  const [step, setStep] = useState("subscription");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscriptionSelect = (plan: any) => {
    setSelectedPlan(plan);
    setStep("personal-info");
  };

  return (
    <div className="space-y-4">
      {step === "subscription" ? (
        <SubscriptionSelection
          onSubscriptionSelect={handleSubscriptionSelect}
        />
      ) : (
        <PersonalInfoForm
          selectedPlan={selectedPlan}
          onBack={() => setStep("subscription")}
        />
      )}
    </div>
  );
};