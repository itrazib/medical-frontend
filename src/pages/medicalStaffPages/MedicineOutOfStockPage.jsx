import React, { useEffect, useState } from "react";
import axios from "axios";

// Medicine Card
function MedicineCard({ med }) {
  const isZero = med.monthlyStockQuantity === 0;

  const badgeText = isZero
    ? "Out of Stock"
    : `Low Stock: ${med.monthlyStockQuantity}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <span
        className={`text-xs px-2 py-1 rounded ${
          isZero ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {badgeText}
      </span>

      <h3 className="text-xl font-semibold mt-3">{med.name}</h3>

      <p>Generic: {med.genericName}</p>
      <p>Manufacturer: {med.manufacturer}</p>
      <p>Type: {med.type}</p>
      <p>Batch: {med.batchNumber}</p>
      <p>
        Expiry:{" "}
        {med.expiryDate
          ? new Date(med.expiryDate).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
}

function LoadingState() {
  return <p className="text-center">Loading...</p>;
}

function ErrorState({ message }) {
  return <p className="text-center text-red-500">{message}</p>;
}

function EmptyState() {
  return (
    <p className="text-center text-gray-500">
      All medicines are sufficiently stocked! ✅
    </p>
  );
}

export default function MedicineOutOfStockPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/medical-staff/low-stock?threshold=5`,{
            withCredentials: true
          }
        );

        const resData = res.data;

        // 🔥 SAFE FIX (IMPORTANT)
        const safeData = Array.isArray(resData)
          ? resData
          : Array.isArray(resData?.data)
          ? resData.data
          : [];

        // 🔥 SORT SAFE
        const sorted = [...safeData].sort((a, b) => {
          if (
            a.monthlyStockQuantity === 0 &&
            b.monthlyStockQuantity !== 0
          )
            return -1;

          if (
            a.monthlyStockQuantity !== 0 &&
            b.monthlyStockQuantity === 0
          )
            return 1;

          return (
            (a.monthlyStockQuantity || 0) -
            (b.monthlyStockQuantity || 0)
          );
        });

        setMedicines(sorted);
      } catch (err) {
        console.error(err);
        setError("Couldn’t load medicines. Please try again.");
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-16">
      <h2 className="text-3xl text-center mb-8">
        Medicines Low & Out of Stock
      </h2>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : medicines.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <MedicineCard key={med._id} med={med} />
          ))}
        </div>
      )}
    </div>
  );
}