import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@testing-library/jest-dom';
import PaymentReconciliation from './Payment-reconciliation';

// Mock data stays the same
const mockPayments = [
  {
    id: 1,
    memberName: 'John Doe',
    subscription_type: 'Premium',
    amountPaid: 99.99,
    payment_date: '2024-01-01',
    payment_method: 'Credit Card',
    balance: 0,
    reconciliation_status: 'Reconciled'
  },
  {
    id: 2,
    memberName: 'Jane Smith',
    subscription_type: 'Basic',
    amountPaid: 49.99,
    payment_date: '2024-01-02',
    payment_method: 'PayPal',
    balance: 10,
    reconciliation_status: 'Pending'
  }
];

// Mocks stay the same
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
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}));
jest.mock('axios');
jest.mock('@/components/ui/sidebar', () => ({
  useIsMobile: () => false,
}));

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

describe('PaymentReconciliation', () => {
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
    let resolvePayments: (value: any) => void;
    const paymentsPromise = new Promise((resolve) => { resolvePayments = resolve; });
    (axios.get as jest.Mock).mockImplementation(() => paymentsPromise);

    await act(async () => {
      render(<PaymentReconciliation />);
    });

    expect(screen.getByText('Loading members...')).toBeInTheDocument();

    // Resolve the promise to clean up
    await act(async () => {
      resolvePayments!({ data: { payments: mockPayments } });
    });
  });

  it('renders payments after loading', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { payments: mockPayments } });

    await act(async () => {
      render(<PaymentReconciliation />);
    });

    // payments to be rendered
    const johnDoe = await screen.findByText('John Doe');
    expect(johnDoe).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('£99.99')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock API failure
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to load'));

    await act(async () => {
      render(<PaymentReconciliation />);
    });


    const errorMessage = await screen.findByText('Failed to load payment data.');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('opens adjustment modal when clicking adjust button', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { payments: mockPayments } });

    await act(async () => {
      render(<PaymentReconciliation />);
    });

    // payments to load
    const johnDoe = await screen.findByText('John Doe');
    expect(johnDoe).toBeInTheDocument();

    // click the adjust button
    const adjustButtons = screen.getAllByText('Adjust');
    await act(async () => {
      fireEvent.click(adjustButtons[0]);
    });

    // check if modal is open
    expect(screen.getByText('Adjust Payment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter adjustment amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter reason for adjustment')).toBeInTheDocument();
  });

  it('submits payment adjustment successfully', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { payments: mockPayments } });
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      render(<PaymentReconciliation />);
    });

    const johnDoe = await screen.findByText('John Doe');
    expect(johnDoe).toBeInTheDocument();

    // open adjustment modal
    const adjustButtons = screen.getAllByText('Adjust');
    await act(async () => {
      fireEvent.click(adjustButtons[0]);
    });

    // fill in adjustment details
    const amountInput = screen.getByPlaceholderText('Enter adjustment amount');
    const reasonInput = screen.getByPlaceholderText('Enter reason for adjustment');

    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '10.00' } });
      fireEvent.change(reasonInput, { target: { value: 'Test adjustment' } });
    });

    // submit adjustment
    const submitButton = screen.getByText('Submit Adjustment');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // verify API call
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/accountant/payments/1/adjust'),
      {
        adjustment: 10,
        reason: 'Test adjustment'
      },
      expect.any(Object)
    );
  });
});