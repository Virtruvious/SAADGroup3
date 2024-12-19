import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreatePurchaseOrderPage from './CreateOrder';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock data
const mockVendors = [
  { vendor_id: "1", name: "Vendor 1" },
  { vendor_id: "2", name: "Vendor 2" },
];

const mockBranches = [
  { branch_id: "1", branch_name: "Branch 1", location: "Location 1" },
  { branch_id: "2", branch_name: "Branch 2", location: "Location 2" },
];

// Mock router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
};


jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: () => mockRouter
}));
jest.mock('axios');

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


global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};


window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('CreatePurchaseOrderPage', () => {
  const mockPurchaseManagerSession = {
    data: {
      user: {
        email: 'PM@example.com',
        role: 'purchase_manager',
        id: '123'
      },
      jwt: 'mock-jwt-token'
    },
    status: 'authenticated' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockPurchaseManagerSession);

    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/purchaseMan/vendors')) {
        return Promise.resolve({ data: { vendors: mockVendors } });
      }
      if (url.includes('/purchaseMan/branches')) {
        return Promise.resolve({ data: { branches: mockBranches } });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders loading state initially', async () => {
    let resolveVendors: (value: any) => void;
    let resolveBranches: (value: any) => void;
    const vendorsPromise = new Promise((resolve) => { resolveVendors = resolve; });
    const branchesPromise = new Promise((resolve) => { resolveBranches = resolve; });

    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/purchaseMan/vendors')) return vendorsPromise;
      if (url.includes('/purchaseMan/branches')) return branchesPromise;
      return Promise.reject(new Error('Not found'));
    });

    render(<CreatePurchaseOrderPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      resolveVendors!({ data: { vendors: mockVendors } });
      resolveBranches!({ data: { branches: mockBranches } });
    });
  });

  it('shows unauthorized message for non-purchase manager', async () => {

    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'regular@example.com',
          role: 'staff',
          id: '123'
        }
      },
      status: 'authenticated'
    });

    await act(async () => {
      render(<CreatePurchaseOrderPage />);
    });
    
    
    expect(screen.getByText(/You are not authorized to access this page/)).toBeInTheDocument();
  });

  it('loads and displays vendors and branches', async () => {
    render(<CreatePurchaseOrderPage />);

    await waitFor(() => {
      const vendorSelect = screen.getByRole('combobox', { name: /select vendor/i });
      expect(vendorSelect).toBeInTheDocument();
    });

    const vendorSelect = screen.getByRole('combobox', { name: /select vendor/i });
    await act(async () => {
      fireEvent.click(vendorSelect);
    });

    await waitFor(() => {
      expect(screen.getByText('Vendor 1')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<CreatePurchaseOrderPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching initial data:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});