import React, { useState, useEffect } from "react";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ArrowUpDown } from "lucide-react";

interface PaymentAnalytics {
  total_payments: number;
  matched_payments: number;
  underpaid: number;
  overpaid: number;
  total_amount: number;
  avg_payment_delay: number;
}

interface PaymentMethodSummary {
  payment_method: string;
  total_transactions: number;
  total_amount: number;
}

interface OutstandingBalance {
  memberName: string;
  balance: number;
  subscription_type: string;
  last_payment_date: string;
}

const API_BASE_URL = "http://localhost:8000";

const FinancialReports: React.FC = () => {
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSummary[]>(
    []
  );
  const [outstandingBalances, setOutstandingBalances] = useState<
    OutstandingBalance[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.jwt) {
      fetchReportData();
    }
  }, [session, timeFrame]);

  const fetchReportData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${session?.jwt}`,
      };

      console.log("Current timeFrame:", timeFrame); // Add this

      const analyticsUrl = `${API_BASE_URL}/accountant/payments/extendedAnalytics?timeFrame=${timeFrame}`;
      console.log("Analytics URL:", analyticsUrl); // Add this

      const [analyticsRes, methodsRes, balancesRes] = await Promise.all([
        axios.get(analyticsUrl, { headers }),
        axios.get(
          `${API_BASE_URL}/accountant/payments/methods?timeFrame=${timeFrame}`,
          { headers }
        ),
        axios.get(`${API_BASE_URL}/accountant/payments/outstanding`, {
          headers,
        }),
      ]);

      console.log("Raw Analytics Response:", analyticsRes.data);
      setAnalytics(analyticsRes.data.analytics);

      console.log("Analytics Response:", analyticsRes.data); // Add this log
      console.log("Methods Response:", methodsRes.data); // Add this log
      setPaymentMethods(methodsRes.data.methods);
      setOutstandingBalances(balancesRes.data.balances);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setLoading(false);
    }
  };

  const exportToCSV = async (type: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${session?.jwt}`,
      };

      const response = await axios.get(
        `${API_BASE_URL}/accountant/reports/export?type=${type}&timeFrame=${timeFrame}`,
        {
          headers,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-report-${timeFrame}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (loading) {
    return (
      <StaffLayout>
        <StaffHeader title="Financial Reports" />
        <div className="flex justify-center items-center h-64">
          Loading reports...
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title="Financial Reports" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <div className="flex items-center gap-4">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">
              £{analytics[0]?.total_amount}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => exportToCSV("revenue")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              Payment Reconciliation
            </h3>
            {analytics[0]?.total_payments > 0 ? (
              <div className="space-y-2">
                <p>Matched: {analytics[0]?.matched_payments}</p>
                <p>Underpaid: {analytics[0]?.underpaid}</p>
                <p>Overpaid: {analytics[0]?.overpaid}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No payments to reconcile during this period
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => exportToCSV("reconciliation")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <div
                  key={method.payment_method}
                  className="flex justify-between"
                >
                  <span>{method.payment_method}</span>
                  <span>{method.total_transactions}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No payment methods data for this period
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => exportToCSV("methods")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Card>
        </div>

        {/* Outstanding Balances Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Outstanding Balances</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV("outstanding")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Subscription Type</TableHead>
                <TableHead>Last Payment Date</TableHead>
                <TableHead className="text-right">
                  Outstanding Balance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outstandingBalances.map((item) => (
                <TableRow key={item.memberName}>
                  <TableCell>{item.memberName}</TableCell>
                  <TableCell>{item.subscription_type}</TableCell>
                  <TableCell>
                    {new Date(item.last_payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    £{item.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </StaffLayout>
  );
};

export default FinancialReports;
