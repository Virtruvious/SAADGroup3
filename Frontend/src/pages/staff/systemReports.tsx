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
import { report } from "process";

interface OutstandingBalance {
  memberName: string;
  balance: number;
  subscription_type: string;
  last_payment_date: string;
}

interface ReportContent {
  stats: {
    total_active_users: number;
    total_books_borrowed: number;
    total_reserved_books: number;
  };
  perf: {
    uptime: number;
    response_time: number;
    newErrors: number;
  };
  topBooks: [
    {
      media_id: number;
      title: string;
      number_of_borrows: number;
    }
  ]
}

const API_BASE_URL = "http://localhost:8000";

const SystemReports: React.FC = () => {
  const [reportContent, setReportContent] = useState<ReportContent | null>(null);
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

      const reportsUrl = `${API_BASE_URL}/admin/getReport?timeFrame=${timeFrame}`;

      const response = await axios.get(reportsUrl, { headers });

      console.log("Report data:", response.data);

      setReportContent(response.data);
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
        <StaffHeader title="System Reports" />
        <div className="flex justify-center items-center h-64">
          Loading reports...
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title="System Reports" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Library System Reports</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => exportToCSV("revenue")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Active Users</h3>
            <p className="text-3xl font-bold">{reportContent?.stats.total_active_users}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Books Borrowed</h3>
            <p className="text-3xl font-bold">{reportContent?.stats.total_books_borrowed}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Reserved Books</h3>
            <p className="text-3xl font-bold">{reportContent?.stats.total_reserved_books}</p>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">System Performance</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Uptime</h3>
              <p className="text-3xl font-bold text-green-500">{reportContent?.perf.uptime}%</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">API Response Time</h3>
              <p className="text-3xl font-bold text-green-500">{reportContent?.perf.response_time}ms</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">New Errors Found</h3>
              <p className="text-3xl font-bold text-green-500">{reportContent?.perf.newErrors}</p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Most Borrowed Books</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Name</TableHead>
                <TableHead>Book ID</TableHead>
                <TableHead className="text-right">
                  # of Borrows <ArrowUpDown className="w-4 h-4 inline-block" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportContent?.topBooks.map((item) => (
                <TableRow key={item.title}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.media_id}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.number_of_borrows}
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

export default SystemReports;
