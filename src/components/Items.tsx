import React, { useState } from "react";

const categoryColors: Record<string, string> = {
  Transport: "border-sky-400 text-sky-500 bg-sky-50",
  Food: "border-green-400 text-green-500 bg-green-50",
  Shopping: "border-purple-400 text-purple-500 bg-purple-50",
  Bills: "border-pink-400 text-pink-600 bg-pink-50",
  Entertainment: "border-blue-400 text-blue-600 bg-blue-50",
  Others: "border-gray-400 text-gray-500 bg-gray-50",
};
interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ItemsProps {
  item: Expense;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string) => void;
}

const Items = ({ item, handleDelete, handleUpdate }: ItemsProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 last:border-none py-3">
      {/* Left Side */}
      <div>
        <div className="flex items-center gap-3">
          <h3 className=" font-semibold text-gray-900">{item.title}</h3>

          <span
            className={`rounded-full border  px-3 py-1 text-xs font-medium  ${categoryColors[item.category] || "border-gray-400 text-gray-500 bg-gray-50"}`}
          >
            {item.category}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">{item.date}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <p className=" font-semibold text-gray-900">US${item.amount}</p>

        <button
          onClick={() => handleUpdate(item._id)}
          className="text-black transition hover:opacity-70"
        >
          ✏️
        </button>

        <button
          onClick={() => handleDelete(item._id)}
          className="text-red-800 transition  hover:opacity-70"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Items;
