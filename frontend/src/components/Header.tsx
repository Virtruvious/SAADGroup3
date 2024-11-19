import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Check, Clock, CalendarRange } from 'lucide-react';
import Link from "next/link";

const LoginForm = () => (
  <form className="space-y-4">
    <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="Enter your email" required />
    </div>
    <div>
      <label htmlFor="password" className="block mb-2 text-sm font-medium">
        Password
      </label>
      <Input id="password" type="password" placeholder="Enter your password" required />
    </div>
    <Button type="submit" className="w-full">Login</Button>
  </form>
);

const SubscriptionCard = ({ type, price, savings, features, value, selected, onChange }) => (
  <Card className={`relative transition-all duration-200 ${
    selected === value 
      ? 'border-2 border-primary shadow-lg' 
      : 'hover:border-primary/50 hover:shadow-md'
  }`}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value} className="cursor-pointer">
            <CardTitle className={`text-lg ${selected === value ? 'text-primary' : ''}`}>
              {type}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {savings}
            </CardDescription>
          </Label>
        </div>
        {type === 'Annual Membership' && (
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
            {value === 'annual' ? '/year' : '/month'}
          </span>
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
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

const SubscriptionSelection = ({ onSubscriptionSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
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
            "Free home delivery service"
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
            "Cancel anytime"
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
            Continue with {selected === 'annual' ? 'Annual' : 'Monthly'} Plan
          </Button>
        </div>
      )}
    </div>
  );
};

const PersonalInfoForm = ({ selectedPlan, onBack }) => (
  <form className="space-y-4">
    <div className="text-center mb-6">
      <h3 className="text-lg font-medium">Complete your registration</h3>
      <p className="text-sm text-muted-foreground">
        Selected plan: {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Membership
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
          First Name
        </label>
        <Input id="firstName" type="text" placeholder="First name" required />
      </div>
      <div>
        <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
          Last Name
        </label>
        <Input id="lastName" type="text" placeholder="Last name" required />
      </div>
    </div>

    <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="Email address" required />
    </div>

    <div>
      <label htmlFor="phone" className="block mb-2 text-sm font-medium">
        Phone Number
      </label>
      <Input id="phone" type="tel" placeholder="Phone number" required />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="postcode" className="block mb-2 text-sm font-medium">
          Postcode
        </label>
        <Input id="postcode" type="text" placeholder="Postcode" required />
      </div>
      <div>
        <label htmlFor="houseNumber" className="block mb-2 text-sm font-medium">
          House Number
        </label>
        <Input id="houseNumber" type="text" placeholder="House number" required />
      </div>
    </div>

    <div>
      <label htmlFor="password" className="block mb-2 text-sm font-medium">
        Password
      </label>
      <Input id="password" type="password" placeholder="Create password" required />
    </div>

    <div className="flex space-x-4">
      <Button type="button" variant="outline" onClick={onBack} className="w-full">
        Back
      </Button>
      <Button type="submit" className="w-full">
        Complete Registration
      </Button>
    </div>
  </form>
);

const SignupForm = () => {
  const [step, setStep] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscriptionSelect = (plan) => {
    setSelectedPlan(plan);
    setStep('personal-info');
  };

  return (
    <div className="space-y-4">
      {step === 'subscription' ? (
        <SubscriptionSelection onSubscriptionSelect={handleSubscriptionSelect} />
      ) : (
        <PersonalInfoForm 
          selectedPlan={selectedPlan} 
          onBack={() => setStep('subscription')} 
        />
      )}
    </div>
  );
};

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>House & Location</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4">
                      <p>Location content here</p>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Help</Button>
            <Button onClick={() => setIsModalOpen(true)}>Login / Register</Button>
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            </div>
          </div>
        </div>

        <nav className="border-t">
          <ul className="flex space-x-8 py-4 overflow-x-auto">
            {[
              "Browse the Library",
              "Services",
              "Research",
              "Spaces",
              "Contact Us",
              "Events",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Access</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;