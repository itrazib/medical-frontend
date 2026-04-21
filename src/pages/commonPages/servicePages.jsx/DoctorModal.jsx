import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorModal({ close }) {
  const [doctors, setDoctors] = useState([]);
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get(
        `${backendURL}/doctor/available`
      );
      console.log("Available Doctors:", res.data);
      setDoctors(res.data);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white p-5 shadow-xl w-80 rounded-xl z-50 relative">
      
      {/* ❌ Close Button */}
      <button
        onClick={close}
        className="absolute top-2 right-2 text-red-500 font-bold"
      >
        ✖
      </button>

      <h2 className="text-lg font-bold mb-3">Available Doctors</h2>

      {doctors.length === 0 && <p>No doctors available</p>}

      {doctors.map((d, i) => (
        <div key={i} className="border p-2 mb-2 rounded">
          {/* 🔥 FIX: doctor instead of staff */}
          <p className="font-semibold">{d.doctor?.name}</p>
          <p>{d.department}</p>
          <p>
            {d.startTime} - {d.endTime}
          </p>
        </div>
      ))}
    </div>
  );
}