import React, { useState } from "react";


const PurchaseForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: "",
    Quantity: "",
    Media: "",
    date: "",
    
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    
    onClose(); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Create Report</h1>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
            Media
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border-gray-300 border rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Book">Book</option>
            <option value="Movie">Movie</option>
            <option value="AudioBook">Audio Book</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="Quantity" className="block text-gray-700 font-medium mb-2">
            Quantity
          </label>
          <input
            type="text"
            id="Quantity"
            name="Quantity"
            placeholder="Enter Quantity of item required"
            value={formData.Quantity}
            onChange={handleInputChange}
            className="w-full border-gray-300 border rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Media" className="block text-gray-700 font-medium mb-2">
            Name of media
          </label>
          <input
            type="text"
            id="Media"
            name="Media"
            placeholder="Enter name of media needed"
            value={formData.Media}
            onChange={handleInputChange}
            className="w-full border-gray-300 border rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border-gray-300 border rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>


        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Create Report
          </button>
        </div>
      </form>
    </div>
  );
};

const ManagePurchases: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
    

  const users = [
    { id: 1, name: "Purchase Order 1", Date: "20/11/25" },
    { id: 2, name: "Purchase Order 2", Date: "20/11/24" },
  ];

  const handleUserClick = (user: any) => {
    setSelectedUser(user);

  };

  const handleCloseModal = () => {
    setSelectedUser(null); 
  };


  return (
    <div className="p-6">
        
      <h1 className="text-4xl font-bold text-center mb-8">Manage Purchases</h1>
      
      <div className="text-center mb-6">
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition"
            onClick={() => handleUserClick(user)}
          >
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">Submitted Date: {user.Date}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <PurchaseForm onClose={handleCloseModal} />
          </div>
        </div>
        
      )}
    </div>
    </div>
  );
};

export default ManagePurchases;
