import React, { useState } from "react";
import StaffLayout from "@/layouts/StaffLayout";
import StaffHeader from "@/components/Staff-Header";

const ManageMemberships: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "User 1", expiryDate: "25/11/24" },
    { id: 2, name: "User 2", expiryDate: "25/11/24" },
    { id: 3, name: "User 3", expiryDate: "25/11/24" },
    { id: 4, name: "User 4", expiryDate: "25/11/24" },
    { id: 5, name: "User 5", expiryDate: "25/11/24" },
    { id: 6, name: "User 6", expiryDate: "25/11/24" },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <StaffLayout>
      <StaffHeader title={"Manage Membership"}/>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Manage Memberships</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => handleUserClick(user)}
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">Expiry Date: {user.expiryDate}</p>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <p className="text-center text-gray-700 mb-4">
                Status: <span className="text-red-500">expired, awaiting payment</span>
              </p>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-red-600">
                Delete Membership
              </button>
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                onClick={handleCloseModal}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default ManageMemberships;