import React, { useState, useEffect } from "react";
import axios from "axios";

export const AmbulanceInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/ambulance/current-driver`);

        console.log(res.data);

        // যদি API direct array return করে
        if (Array.isArray(res.data)) {
          setDrivers(res.data);
        }
        // যদি API object এর ভিতরে drivers property return করে
        else if (Array.isArray(res.data.drivers)) {
          setDrivers(res.data.drivers);
        }
        // অন্য কিছু হলে empty array
        else {
          setDrivers([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load ambulance info.");
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return <p>Loading ambulance info…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!Array.isArray(drivers) || drivers.length === 0) {
    return <p>No ambulance drivers assigned this month.</p>;
  }

  return (
    <div>
      <h4 className="font-semibold mb-2">
        Ambulance Drivers for{" "}
        {new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h4>

      <ul className="list-disc list-inside">
        {drivers.map((d) => (
          <li key={d._id}>
            <strong>{d.name}</strong> – {d.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};