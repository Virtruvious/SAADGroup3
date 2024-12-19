import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import { useSession } from "next-auth/react";


interface Payment {
  id: number;
  memberName: string;
  subscription_type: string;
  amountPaid: number;
  payment_date: string;
  payment_method: string;
  balance: number;
  reconciliation_status: string;
}
const API_BASE_URL = "http://localhost:8000";
export const PaymentReconciliation = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/staff/login";
    }
  }, [status]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accountant/payments`);
      setPayments(response.data.payments);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment data.");
      setLoading(false);
    }
  };

  const handleAdjustPayment = () => {
    if (!selectedPayment) return;

    const adjustment = parseFloat(adjustmentAmount);
    if (isNaN(adjustment)) {
      alert("Please enter a valid adjustment amount.");
      return;
    }

    if (!adjustmentReason.trim()) {
      alert("Please provide a reason for the adjustment.");
      return;
    }

    axios.post(`${API_BASE_URL}/accountant/payments/${selectedPayment.id}/adjust`, {
      adjustment,
      reason: adjustmentReason
    },
    {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    }
  )
    .then(() => {
      fetchPayments();
      setSelectedPayment(null);
      setAdjustmentAmount("");
      setAdjustmentReason("");
    })
    .catch((err) => {
      console.error("Error adjusting payment:", err);
      alert("Failed to adjust payment.");
    });
  };


  if (loading) return (
    <StaffLayout>
      <StaffHeader title={"Payment Reconciliation"}/>
      <div className="flex justify-center items-center h-64">
        Loading members...
      </div>
    </StaffLayout>);
  if (error) return (
    <StaffLayout>
      <StaffHeader title={"Payment Reconciliation"}/>
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    </StaffLayout>
  );

  return (
    <StaffLayout>
      <StaffHeader title={"Payment Reconciliation"}/>
      <div className="payment-reconciliation p-6">
        <h1 className="text-2xl font-bold mb-6">Payment Reconciliation</h1>
        <Table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Subscription Type</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.memberName}</td>
                <td>{payment.subscription_type}</td>
                <td>£{payment.amountPaid.toFixed(2)}</td>
                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td>{payment.payment_method}</td>
                <td>£{payment.balance.toFixed(2)}</td>
                <td>{payment.reconciliation_status}</td>
                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        Adjust
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => {
            setSelectedPayment(null);
            setAdjustmentAmount("");
            setAdjustmentReason("");
          }}>
            <DialogContent>
              <DialogTitle>Adjust Payment</DialogTitle>
              <DialogDescription>
                Adjust payment for <strong>{selectedPayment.memberName}</strong>
              </DialogDescription>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Adjustment Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter adjustment amount"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <Input
                    type="text"
                    placeholder="Enter reason for adjustment"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAdjustPayment}>
                    Submit Adjustment
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </StaffLayout>
  );
};

export default PaymentReconciliation;
