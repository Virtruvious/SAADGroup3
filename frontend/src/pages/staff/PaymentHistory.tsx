import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    member_name: string;
  }

const API_BASE_URL = "http://localhost:8000";

export const PaymentHistory = () => {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    if (status === "loading") return;
    if (status === "unauthenticated") {
      window.location.href = "/staff/login";
    }
  }, [status]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/accountant/payments/history`);
        setHistory(response.data.history);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.member_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StaffLayout>
      <StaffHeader title="Payment History" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <Input 
            className="max-w-xs"
            placeholder="Search by member name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Payment Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Adjustment</th>
              <th>Reason</th>
              <th>Adjusted By</th>
              <th>Adjustment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={`${item.payment_id}-${item.adjustment_date}`}>
                <td>{item.member_name}</td>
                <td>£{item.amount.toFixed(2)}</td>
                <td>{new Date(item.payment_date).toLocaleDateString()}</td>
                <td>{item.payment_method}</td>
                <td>{item.adjustment_amount ? `£${item.adjustment_amount}` : '-'}</td>
                <td>{item.reason || '-'}</td>
                <td>{item.adjusted_by || '-'}</td>
                <td>{item.adjustment_date ? new Date(item.adjustment_date).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </StaffLayout>
  );
};

export default PaymentHistory;