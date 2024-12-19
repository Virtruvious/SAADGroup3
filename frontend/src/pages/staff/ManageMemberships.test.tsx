import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@testing-library/jest-dom';
import ManageMemberships from './ManageMemberships';

const mockMembers = [
  {
    user_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    subscription_type: 'Premium',
    end_date: '2024-12-31',
    status: 1,
    amount: 99.99
  }
];

const mockSubscriptionPlans = [
  {
    plan_id: 1,
    name: 'Premium',
    price: 99.99,
    duration: 30,
    billing_frequency: 'monthly'
  }
];

// mock router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
};

// Mocks
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}));
jest.mock('axios');
jest.mock('@/components/ui/sidebar', () => ({
  useIsMobile: () => false,
}));
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

// Mock layouts and components
jest.mock('@/layouts/StaffLayout', () => {
  return function MockStaffLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="staff-layout">{children}</div>;
  };
});

jest.mock('@/components/Staff-Header', () => {
  return function MockStaffHeader({ title }: { title: string }) {
    return <div data-testid="staff-header">{title}</div>;
  };
});

describe('ManageMemberships', () => {
  const mockSession = {
    data: {
      jwt: 'mock-jwt-token',
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'staff'
      }
    },
    status: 'authenticated' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  it('renders loading state initially', async () => {
    let resolveMembers: (value: any) => void;
    let resolvePlans: (value: any) => void;
    const membersPromise = new Promise((resolve) => { resolveMembers = resolve; });
    const plansPromise = new Promise((resolve) => { resolvePlans = resolve; });

    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/accountant/members')) {
        return membersPromise;
      }
      if (url.includes('/accountant/subscription-plans')) {
        return plansPromise;
      }
      return Promise.reject(new Error('Not found'));
    });

    let rendered: any;
    await act(async () => {
      rendered = render(<ManageMemberships />);
    });

    expect(screen.getByText('Loading members...')).toBeInTheDocument();

    await act(async () => {
      resolveMembers!({ data: { members: mockMembers } });
      resolvePlans!({ data: { plans: mockSubscriptionPlans } });
    });
  });

  it('renders members after loading', async () => {
    // mock successful API responses
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/accountant/members')) {
        return Promise.resolve({ data: { members: mockMembers } });
      }
      if (url.includes('/accountant/subscription-plans')) {
        return Promise.resolve({ data: { plans: mockSubscriptionPlans } });
      }
      return Promise.reject(new Error('Not found'));
    });

    await act(async () => {
      render(<ManageMemberships />);
    });

    // wait for the member to be rendered
    const memberName = await screen.findByText('John Doe');
    expect(memberName).toBeInTheDocument();
  });

  it('opens modal when clicking on a member', async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/accountant/members')) {
        return Promise.resolve({ data: { members: mockMembers } });
      }
      if (url.includes('/accountant/subscription-plans')) {
        return Promise.resolve({ data: { plans: mockSubscriptionPlans } });
      }
      return Promise.reject(new Error('Not found'));
    });

    await act(async () => {
      render(<ManageMemberships />);
    });

    // wait for the member to be rendered and click it
    const memberName = await screen.findByText('John Doe');
    await act(async () => {
      fireEvent.click(memberName);
    });

    // check if modal content is visible
    expect(screen.getByText('Change Membership Type')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    //  API failure
    (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to load'));

    await act(async () => {
      render(<ManageMemberships />);
    });

    const errorMessage = await screen.findByText('Failed to load data');
    expect(errorMessage).toBeInTheDocument();
  });
});