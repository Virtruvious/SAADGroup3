import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import { useSession } from "next-auth/react";

interface PaymentHistory {
  payment_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: number;
  subscription_id: number;
  original_amount: string;
  reconciliation_status: string;
  adjustment_amount: string;
  reason: string;
  adjustment_date: string;
  adjusted_by: string;
}

const API_BASE_URL = "http://localhost:8000";

const PaymentHistory = () => {
  const router = useRouter();
  const { memberId } = router.query;
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/staff/login";
    }
  }, [status]);

  useEffect(() => {
    if (memberId && session?.jwt) {
      fetchPaymentHistory();
    }
  }, [memberId, session]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/accountant/payments/history/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        }
      );
      setHistory(response.data.history);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to load payment history");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StaffLayout>
        <StaffHeader title="Payment History" />
        <div className="flex justify-center items-center h-64">
          Loading payment history...
        </div>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout>
        <StaffHeader title="Payment History" />
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title="Payment History" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Members
          </Button>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Original Amount</th>
              <th>Current Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Adjustment</th>
              <th>Reason</th>
              <th>Adjusted By</th>
              <th>Adjustment Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={`${item.payment_id}-${item.adjustment_date}`}>
                <td>{item.payment_id}</td>
                <td>£{parseFloat(item.original_amount).toFixed(2)}</td>
                <td>£{item.amount.toFixed(2)}</td>
                <td>{new Date(item.payment_date).toLocaleDateString()}</td>
                <td>{item.payment_method}</td>
                <td>
                  <span
                    className={
                      item.reconciliation_status === "matched"
                        ? "text-green-500"
                        : item.reconciliation_status === "overpaid"
                        ? "text-blue-500"
                        : "text-red-500"
                    }
                  >
                    {item.reconciliation_status}
                  </span>
                </td>
                <td>
                  {item.adjustment_amount
                    ? `£${parseFloat(item.adjustment_amount).toFixed(2)}`
                    : "-"}
                </td>
                <td>{item.reason || "-"}</td>
                <td>{item.adjusted_by || "-"}</td>
                <td>
                  {item.adjustment_date
                    ? new Date(item.adjustment_date).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </StaffLayout>
  );
};

export default PaymentHistory;
