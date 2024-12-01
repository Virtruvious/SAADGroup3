import React from "react";


function SubscriptionManagementPage() {
  const users = [
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
    { name: "User Name", expiryDate: "Expiry Date" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-8">Manage Subscription</h1>
      <div className="grid grid-cols-4 gap-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md p-4 flex flex-col items-center"
          >
            <div className="text-gray-600 font-medium mb-2">{user.name}</div>
            <div className="text-gray-400 text-sm">{user.expiryDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionManagementPage;