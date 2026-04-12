import axios from "axios";
import React, { useState } from "react";

const DispenseDetail = ({ record, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  console.log(record)

  const backendURL = import.meta.env.VITE_API_BASE_URL;

  async function toggleRequest() {
    setLoading(true);

    const nextStatus =
      record.overallStatus === "pending" ? "completed" : "pending";

    try {
      // 🔥 STEP 1: update status
      await axios.patch(
        `${backendURL}/medical-staff/dispense-records/${record._id}`,
        {
          overallStatus: nextStatus,
        },
        {
          withCredentials: true,
        }
      );

      // 🔥 STEP 2: finalize request
      if (nextStatus === "completed") {
        await axios.post(
          `${backendURL}/medical-staff/dispenses-records/${record._id}/finalize`,
          {}, // ❌ body must be empty
          {
            withCredentials: true,
          }
        );
      }

      onUpdate();
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border flex flex-col justify-between">
      
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Request Details</h2>

        <span
          className={`px-3 py-1 text-sm rounded-full ${
            record.overallStatus === "completed"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {record.overallStatus?.toUpperCase()}
        </span>
      </div>

      {/* MEDICINES */}
      <ul className="divide-y">
         
        {record?.medicines?.map((item, idx) => (
          <li key={item._id || idx} className="py-3 flex justify-between">
            <div>
              <div className="font-medium text-lg">
                {item.medicine?.name || item.medicineName}
              </div>
              <div className="text-sm text-gray-500">
                {item.medicine?.dosage || "No dose info"}
              </div>
            </div>

            <span className="text-xl font-bold text-indigo-700">
              × {item.quantity || item.requestedQuantity || 1}
            </span>
          </li>
        ))}
      </ul>

      {/* BUTTON */}
      <div className="mt-6 text-right">
        <button
          disabled={loading}
          onClick={toggleRequest}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            record.overallStatus === "pending"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "Loading..."
            : record.overallStatus === "pending"
            ? "Mark Completed"
            : "Revert Pending"}
        </button>
      </div>
    </div>
  );
};

export default DispenseDetail;