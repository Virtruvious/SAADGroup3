import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import axios from "axios";
import { Input } from "@/components/ui/input";

const API_BASE_URL = "http://localhost:8000";

const StatusTimeline = ({ status }) => {
    const statuses = ["Pending", "Shipped", "In Transit", "Delivered"];
    const currentIndex = statuses.indexOf(status);
  
    if (status === "Canceled") {
      return (
        <div className="flex flex-col items-center w-full mt-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <span className="text-red-500 font-medium mt-2">Order Canceled</span>
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-between w-full mt-4">
        {statuses.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-2">{step}</span>
            {index < statuses.length - 1 && (
              <div
                className={`h-0.5 w-24 mt-4 ${
                  index < currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

export default function TrackingOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/purchaseMan/trackingOrders`
      );
      setOrders(response.data.tracking);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.post(`${API_BASE_URL}/purchaseMan/updateOrderStatus`, {
        order_id: orderId,
        status: newStatus,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <StaffLayout>
        <StaffHeader title="Order Tracking" />
        <div className="container mx-auto py-8 text-center">Loading...</div>
      </StaffLayout>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const orderDate = new Date(order.order_date);
    const matchesDateRange =
      (!dateRange.from || orderDate >= new Date(dateRange.from)) &&
      (!dateRange.to || orderDate <= new Date(dateRange.to));

    return matchesStatus && matchesDateRange;
  });

  return (
    <StaffLayout>
      <StaffHeader title="Order Tracking" />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Purchase Orders</CardTitle>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="w-40"
                  />
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="w-40"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Status Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(
                  (
                    order // Change this from orders to filteredOrders
                  ) => (
                    <TableRow key={order.tracking_id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.order_id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder={order.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="In Transit">
                              In Transit
                            </SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(order.status_date)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                            <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                              <DialogTitle>
                                Order Details #{order.order_id}
                              </DialogTitle>
                              <DialogDescription>
                                Complete order information and tracking history
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h3 className="font-semibold">
                                    Order Information
                                  </h3>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span className="font-medium">
                                        Vendor:
                                      </span>{" "}
                                      {order.vendor_name}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Order Date:
                                      </span>{" "}
                                      {formatDate(order.order_date)}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Status:
                                      </span>{" "}
                                      {order.status}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Last Updated:
                                      </span>{" "}
                                      {formatDate(order.status_date)}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h3 className="font-semibold">
                                    Order Placed By
                                  </h3>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span className="font-medium">
                                        Staff Member:
                                      </span>{" "}
                                      {order.first_name} {order.last_name}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h3 className="font-semibold mb-2">
                                  Order Progress
                                </h3>
                                <StatusTimeline status={order.status} />
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-semibold">Order Items</h3>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="text-right">
                                          Quantity
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Total
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.order_items.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="max-w-[200px] truncate">
                                            {item.title}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {item.quantity}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            £{Number(item.price).toFixed(2)}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            £
                                            {(
                                              item.quantity * Number(item.price)
                                            ).toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell
                                          colSpan={3}
                                          className="text-right font-medium"
                                        >
                                          Total Order Value:
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                          £
                                          {order.order_items
                                            .reduce(
                                              (sum, item) =>
                                                sum +
                                                item.quantity *
                                                  Number(item.price),
                                              0
                                            )
                                            .toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  );
}
