import React from "react";

export default function Assignment({ title, type, weight, status }) {
  return (
    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{type === "assignment" ? `${weight}%` : `${weight}% (Exam)`}</p>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          status === "Completed"
            ? "bg-green-100 text-green-800"
            : status === "In Progress"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
