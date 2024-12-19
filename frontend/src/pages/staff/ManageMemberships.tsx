import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Member {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  subscription_type?: string;
  end_date?: string;
  status?: number;
  amount?: number;
  payment_date?: string;
  subscription_id?: number;
}

interface SubscriptionPlan {
  plan_id: number;
  name: string;
  price: number;
  duration: number;
  billing_frequency: 'monthly' | 'yearly';
}

const API_BASE_URL = "http://localhost:8000";

const ManageMemberships: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newMembershipType, setNewMembershipType] = useState<string>("");
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/staff/login");
      return;
    }

    if (status === "authenticated" && session?.jwt) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${session?.jwt}`,
      };

      const [membersRes, plansRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/accountant/members`, { headers }),
        axios.get(`${API_BASE_URL}/accountant/subscription-plans`, { headers })
      ]);
      

      setMembers(membersRes.data.members);
      setSubscriptionPlans(plansRes.data.plans);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleUserClick = (member: Member) => {
    setSelectedUser(member);
    setNewMembershipType(member.subscription_type || "");
    setAdjustmentReason("");
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setNewMembershipType("");
    setAdjustmentReason("");
  };

  const handleViewHistory = (userId: number) => {
    router.push(`/staff/payments/history/${userId}`);
  };

  const handleChangeMembership = async () => {
    if (!selectedUser || !newMembershipType || !adjustmentReason) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/accountant/members/${selectedUser.user_id}/membership`,
        {
          newType: newMembershipType,
          reason: adjustmentReason,
          currentSubscriptionId: selectedUser.subscription_id
        },
        {
          headers: {
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );

      if (response.status === 200) {
        // Update the local state with the new membership type
        setMembers(members.map(member => 
          member.user_id === selectedUser.user_id 
            ? { ...member, subscription_type: newMembershipType }
            : member
        ));
        setSelectedUser(prev => prev ? { ...prev, subscription_type: newMembershipType } : null);
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error changing membership type:", err);
      alert("Failed to change membership type");
    }
  };

  if (status === "loading" || loading) {
    return (
      <StaffLayout>
        <StaffHeader title="Manage Membership" />
        <div className="flex justify-center items-center h-64">
          Loading members...
        </div>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout>
        <StaffHeader title="Manage Membership" />
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title="Manage Membership" />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          Manage Memberships
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => handleUserClick(member)}
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold">{`${member.first_name} ${member.last_name}`}</p>
              <p className="text-sm text-gray-600">
                Expiry Date: {new Date(member.end_date).toUTCString() || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-center mb-4">
                {`${selectedUser.first_name} ${selectedUser.last_name}`}
              </h2>
              <p className="text-center text-gray-700 mb-4">
                Email: {selectedUser.email}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type
                </label>
                <Select value={newMembershipType} onValueChange={setNewMembershipType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select membership type" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map((plan) => (
                      <SelectItem key={plan.plan_id} value={plan.name}>
                        {plan.name} - £{plan.price}/{plan.billing_frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Change
                </label>
                <Input
                  type="text"
                  placeholder="Enter reason for change"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
              </div>
              <p className="text-center text-gray-700 mb-4">
                Current Amount: £{selectedUser.amount || "N/A"}
              </p>
              <p className="text-center text-gray-700 mb-4">
                Status:{" "}
                <span
                  className={
                    selectedUser.status === 1
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {selectedUser.status === 1
                    ? "Active"
                    : selectedUser.status === 0
                    ? "Inactive"
                    : "No active subscription"}
                </span>
              </p>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-600"
                onClick={() => handleViewHistory(selectedUser.user_id)}
              >
                View Payment History
              </button>
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-green-600"
                onClick={handleChangeMembership}
                disabled={!newMembershipType || !adjustmentReason || newMembershipType === selectedUser.subscription_type}
              >
                Change Membership Type
              </button>
              <button
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default ManageMemberships;