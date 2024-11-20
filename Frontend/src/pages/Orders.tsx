import React from "react";
import Link from "next/link";

const Orders: React.FC = () => {
  const borrowedItems = [
    { item: "Book A",  view:"view" },
    { item: "Book B",  view:"view" },
  ];

  const reservedItems = [
    { item: "Book C",  view:"view"},
    { item: "Book D",  view:"view"},
  ];

  const returnedItems = [
    { item: "Book E", view:"view"},
    { item: "Book F", view:"view"},
  ];

  
  const renderTable = (data: any[], columns: string[]) => {
    return (
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border px-3 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              {Object.values(row).map((value, i) => (
                <td key={i} className="border px-3 py-2">
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      
      <section className="border-b bg-muted/50 w-full flex justify-center items-center">
        <div className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold">Orders</h1>
          </div>
        </div>
      </section>

      
      <section className="flex flex-wrap justify-center gap-8 py-8">
        
        <div className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Borrowed Items</h2>
          {renderTable(borrowedItems, ["Item", "Link"])}
        </div>

        
        <div className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Reserved Items</h2>
          {renderTable(reservedItems, ["Item", "Link"])}
        </div>

        
        <div className="w-full max-w-sm bg-white shadow-md rounded-md p-6 border border-black">
          <h2 className="text-lg font-semibold mb-4">Returned Items</h2>
          {renderTable(returnedItems, ["Item", "Link"])}
        </div>
      </section>
    </>
  );
};

export default Orders;

