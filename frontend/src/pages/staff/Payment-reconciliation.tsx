import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";


interface Payment {
  id: number;
  memberName: string;
  subscriptionType: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  balance: number;
  status: string;
}
const API_BASE_URL = "http://localhost:8000";
export const PaymentReconciliation = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>("");

  useEffect(() => {
    const fetchPayments = async () => {
        try {
            const [paymentsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/accountant/payments`),
            ]);
    
            const paymentsData = paymentsRes.data;
            setPayments(paymentsData.payments);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError("Failed to load payment data.");
            setLoading(false);
        }}
    fetchPayments();
  }, []);

  const handleAdjustPayment = () => {
    if (!selectedPayment) return;

    const adjustment = parseFloat(adjustmentAmount);
    if (isNaN(adjustment)) {
      alert("Please enter a valid adjustment amount.");
      return;
    }

    const paymentId = selectedPayment.id;
    axios
      .post(`${API_BASE_URL}/accountant/payments/${paymentId}/adjust`, {
        adjustment,
      })
      .then(() => {
        alert("Payment adjusted successfully.");
        setSelectedPayment(null);
        setAdjustmentAmount("");
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
      <div className="flex justify-center items-center h-64">
        Loading members...
      </div>
    </StaffLayout>);

  return (
    <StaffLayout>
        <StaffHeader title={"Payment Reconciliation"}/>
    <div className="payment-reconciliation">
      <h1 className="text-xl font-bold mb-4">Payment Reconciliation</h1>
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
              <td>{payment.subscriptionType}</td>
              <td>{payment.amountPaid}</td>
              <td>{new Date(payment.paymentDate).toUTCString()}</td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.balance}</td>
              <td>{payment.status}</td>
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
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent>
            <DialogTitle>Adjust Payment</DialogTitle>
            <DialogDescription>
              Adjust payment for <strong>{selectedPayment.memberName}</strong>
            </DialogDescription>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter adjustment amount"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
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
