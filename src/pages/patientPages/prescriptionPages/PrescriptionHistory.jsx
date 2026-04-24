import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionCard from "../../../components/PrescriptionCard";
import useAuth from "../../../hooks/useauth";

const PrescriptionHistory = () => {
  const { user: patient } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);

  const backendURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!patient?.id) return;

        const { data } = await axios.get(
          `${backendURL}/patient/prescription-history/${patient.id}`,
          { withCredentials: true },
        );

        // ✅ SAFE ARRAY HANDLING
        const list = Array.isArray(data?.prescriptions)
          ? data.prescriptions
          : [];

        setPrescriptions(list);
      } catch (err) {
        console.log(err);
        setPrescriptions([]);
      }
    };

    loadHistory();
  }, [patient?.id]);

  return (
    <div className="w-full min-h-screen px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 py-10 bg-teal-50">
      <div className="border border-gray-400 shadow-lg rounded-xl p-10 bg-white">
        <h2 className="text-center text-2xl font-bold mb-6 text-teal-700">
          Your Prescriptions
        </h2>

        <div className="flex flex-col items-center gap-6">
          {(prescriptions || []).length > 0 ? (
            (prescriptions || []).map((p) => (
              <PrescriptionCard key={p._id} prescription={p} />
            ))
          ) : (
            <p className="text-center text-gray-600">No prescriptions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistory;
