import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";

interface Member {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  subscription_type?: string;
  end_date?: string;
  subscription_status?: number;
  payment_amount?: number;
  payment_date?: string;
}
const API_BASE_URL = "http://localhost:8000";
const ManageMemberships: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const [membersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/accountant/members`),
        ]);

        const membersData = await membersRes.json();
        setMembers(membersData.members);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        console.log(err);
        setError("Failed to load members");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleUserClick = (member: Member) => {
    setSelectedUser(member);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteMembership = async () => {
    if (!selectedUser) return;

    try {
      // Implement delete membership logic here
      // This would typically involve calling an API endpoint to update/delete the membership
      console.log(`Deleting membership for user ${selectedUser.user_id}`);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting membership:", err);
    }
  };

  console.log(selectedUser?.subscription_status);

  if (loading) {
    return (
      <StaffLayout>
        <StaffHeader title={"Manage Membership"}/>
        <div className="flex justify-center items-center h-64">
          Loading members...
        </div>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout>
        <StaffHeader title={"Manage Membership"}/>
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <StaffHeader title={"Manage Membership"}/>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Manage Memberships</h1>

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
                Expiry Date: {new Date(member.end_date).toUTCString() || 'N/A'}
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
              <p className="text-center text-gray-700 mb-4">
                Subscription Type: {selectedUser.subscription_type?.toLocaleUpperCase() || 'N/A'}
              </p>
              <p className="text-center text-gray-700 mb-4">
                Payment Amount: £{selectedUser.payment_amount || 'N/A'}
              </p>
              <p className="text-center text-gray-700 mb-4">
                Status: {' '}
                <span className={
                  selectedUser.subscription_status === 1 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }>
                  {selectedUser.subscription_status === 1 
                    ? 'Active' 
                    : selectedUser.subscription_status === 0
                      ? 'Inactive'
                      : 'No active subscription'}
                </span>
              </p>
              <button 
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-red-600"
                onClick={handleDeleteMembership}
              >
                Delete Membership
              </button>
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
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