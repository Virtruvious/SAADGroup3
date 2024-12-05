import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import axios from "axios";
import { useSession } from "next-auth/react";
import router from "next/router";
import { Toast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:8000";

export default function CreatePurchaseOrderPage() {
  const { data: session, status } = useSession();
  const [selectedVendor, setSelectedVendor] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [backendVendors, setBackendVendors] = useState([]);
  const [vendorMedia, setVendorMedia] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    branchId: "",
    deliveryDate: "",
  });
  const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)


  useEffect(() => {
    if (status === "authenticated") {
      const userEmail = session?.user?.email || "";
      const isPurchaseManager = session?.user?.role === "purchase_manager";

      console.log("User email:", userEmail);
      console.log("Is purchase manager:", isPurchaseManager);
      
      if (!isPurchaseManager) {
        router.push("/unauthorized");
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "loading") return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [vendorsRes, branchesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/purchaseMan/vendors`),
          axios.get(`${API_BASE_URL}/purchaseMan/branches`),
        ]);

        setBackendVendors(vendorsRes.data.vendors);
        setBranches(branchesRes.data.branches);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, [status]);

  // Fetch vendor media only when vendor is selected
  useEffect(() => {
    if (!selectedVendor) return;

    const fetchVendorMedia = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/purchaseMan/vendorMedia/${selectedVendor}`
        );
        setVendorMedia(response.data.media);
      } catch (error) {
        console.error("Error fetching vendor media:", error);
      }
    };

    fetchVendorMedia();
  }, [selectedVendor]);

  const [manualItem, setManualItem] = useState({
    vendor_id: "",
    title: "",
    author: "",
    media_type: "",
    publication_year: "",
    description: "",
    price: "",
    image: "",
    quantity: 1,
  });

  const handleAddItem = (item) => {
    const existingItemIndex = mediaItems.findIndex(
      (mediaItem) => mediaItem.media_id === item.media_id
    );
  
    if (existingItemIndex !== -1) {
      const updatedItems = [...mediaItems];
      updatedItems[existingItemIndex].quantity += 1;
      setMediaItems(updatedItems);
    } else {
      // add quantity when adding from catalog
      const itemWithQuantity = {
        ...item,
        price: Number(item.price), 
        quantity: 1 
      };
      setMediaItems([...mediaItems, itemWithQuantity]);
      setToastMessage({ message: "Item added to order", type: "success" });
    }
  };

  const handleAddManualItem = async () => {
    if (!manualItem.title || !manualItem.price || !manualItem.vendor_id || !manualItem.media_type) return;
  
    try {
      const itemToSubmit = {
        ...manualItem,
        price: Number(manualItem.price)
      };
  
      const response = await axios.post(
        `${API_BASE_URL}/purchaseMan/createMedia`,
        itemToSubmit
      );
  
      const itemWithQuantity = {
        ...manualItem,
        media_id: response.data.media.id,
        price: Number(manualItem.price),
        quantity: 1
      };
  
      const existingItemIndex = mediaItems.findIndex(
        (mediaItem) => mediaItem.media_id === response.data.media.id
      );
  
      if (existingItemIndex !== -1) {
        const updatedItems = [...mediaItems];
        updatedItems[existingItemIndex].quantity += 1;
        setMediaItems(updatedItems);
      } else {
        setMediaItems(prevItems => [...prevItems, itemWithQuantity]);
        setToastMessage({ message: "Item added to order", type: "success" });
      }
  
      // reset form
      setManualItem({
        vendor_id: "",
        title: "",
        author: "",
        media_type: "",
        image: "",
        publication_year: "",
        description: "",
        price: "",
        quantity: 1,
      });
  
      if (selectedVendor === manualItem.vendor_id) {
        const mediaResponse = await axios.get(
          `${API_BASE_URL}/purchaseMan/vendorMedia/${selectedVendor}`
        );
        setVendorMedia(mediaResponse.data.media);
      }
    } catch (error) {
      console.error("Error adding media:", error);
      setToastMessage({ message: "Failed to add item to order", type: "error" });
    }
  };

  const handleRemoveItem = (index) => {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
    setToastMessage({ message: "Item removed from order", type: "info" });
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...mediaItems];
    updatedItems[index].quantity = Math.max(1, value);
    setMediaItems(updatedItems);
  };

  const handleSubmitOrder = async () => {
    if (session?.user?.role !== "purchase_manager") { 
      console.error("Unauthorized access");
      return;
    }

    const orderData = {
      vendor_id: selectedVendor,
      user_id: session?.user?.id,
      items: mediaItems.map(item => ({
        media_id: item.media_id,
        quantity: item.quantity,
        price: item.price
      })),
      branch_id: orderDetails.branchId,
      delivery_date: orderDetails.deliveryDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/purchaseMan/purchaseOrder`,
        orderData
      );
      setToastMessage({ message: "Order created successfully", type: "success" });
      console.log("Order created:", response.data);
      setMediaItems([]);
      setSelectedVendor("");
      setOrderDetails({
        branchId: "",
        deliveryDate: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setToastMessage({ message: "Failed to create order", type: "error" });
    }
  };


  const totalOrderValue = mediaItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  if (isLoading || status === "loading") {
    return (
      <StaffLayout>
        <StaffHeader title="Create Purchase Order" />
        <div className="container mx-auto py-8 text-center">Loading...</div>
      </StaffLayout>
    );
  }

  if (
    !session?.user?.email?.includes("PM") || 
    session?.user?.role !== "purchase_manager"
  ) {
    return (
      <StaffLayout>
        <StaffHeader title="Unauthorized Access" />
        <div className="container mx-auto py-8 text-center">
          You are not authorized to access this page. This page is only accessible to staff members with Purchase Manager access.
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title="Create Purchase Order" />
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vendor-select">Select Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger id="vendor-select">
                  <SelectValue placeholder="Choose a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {backendVendors.map((vendor) => (
                    <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="branch-select">Branch Location</Label>
                <Select
                  value={orderDetails.branchId}
                  onValueChange={(value) =>
                    setOrderDetails((prev) => ({ ...prev, branchId: value }))
                  }
                >
                  <SelectTrigger id="branch-select">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem
                        key={branch.branch_id}
                        value={branch.branch_id}
                      >
                        {branch.branch_name} - {branch.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  name="deliveryDate"
                  value={orderDetails.deliveryDate}
                  onChange={(e) =>
                    setOrderDetails((prev) => ({
                      ...prev,
                      deliveryDate: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {isManualEntry ? "Manual Entry" : "Vendor Catalogue"}
              </CardTitle>
              <Button onClick={() => setIsManualEntry(!isManualEntry)}>
                {isManualEntry ? "View Catalog" : "Manual Entry"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isManualEntry ? (
              <div className="space-y-4">
                <Select
                  value={manualItem.vendor_id}
                  onValueChange={(value) =>
                    setManualItem({ ...manualItem, vendor_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {backendVendors.map((vendor) => (
                      <SelectItem
                        key={vendor.vendor_id}
                        value={vendor.vendor_id}
                      >
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Title"
                  value={manualItem.title}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Author"
                  value={manualItem.author}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, author: e.target.value })
                  }
                />
                <Select
                  value={manualItem.media_type}
                  onValueChange={(value) =>
                    setManualItem({ ...manualItem, media_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="journals">Journals</SelectItem>
                    <SelectItem value="periodicals">Periodicals</SelectItem>
                    <SelectItem value="CDs">CDs</SelectItem>
                    <SelectItem value="DVDs">DVDs</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Media Link"
                  value={manualItem.media}
                  onChange={(e) =>
                    setManualItem({
                      ...manualItem,
                      image: e.target.value,
                    })
                  }
                />
                <Input
                  type="date"
                  placeholder="Publication Year"
                  value={manualItem.publication_year}
                  onChange={(e) =>
                    setManualItem({
                      ...manualItem,
                      publication_year: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Description"
                  value={manualItem.description}
                  onChange={(e) =>
                    setManualItem({
                      ...manualItem,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={manualItem.price}
                  onChange={(e) =>
                    setManualItem({
                      ...manualItem,
                      price: e.target.value, // Keep as string in state for controlled input
                    })
                  }
                />
                <Button onClick={handleAddManualItem}>Add Item</Button>
              </div>
            ) : (
              selectedVendor && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorMedia.map((item) => (
                      <TableRow key={item.media_id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>£{item.price}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleAddItem(item)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media Title</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaItems.length > 0 ? (
                  mediaItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(index, item.quantity - 1)
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-16 text-center"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(index, item.quantity + 1)
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>£{item.price}</TableCell>
                      <TableCell>£{item.quantity * item.price}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No items added yet.
                    </TableCell>
                  </TableRow>
                )}
                {mediaItems.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold text-right">
                      Total Order Value:
                    </TableCell>
                    <TableCell className="font-bold">
                      £{totalOrderValue.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8 text-right">
          <Button
            size="lg"
            onClick={handleSubmitOrder}
            disabled={mediaItems.length === 0 || !orderDetails.branchId}
          >
            Submit Order
          </Button>
        </div>
        {toastMessage && (
          <Toast
            message={toastMessage.message}
            onClose={() => setToastMessage(null)}
            type={toastMessage.type}
          />
        )}
      </div>
    </StaffLayout>
  );
}
