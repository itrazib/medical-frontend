import React, { useState, useEffect } from "react";
import axios from "axios";

const AmbulanceAssignmentPage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const defaultMM = String(now.getMonth() + 1).padStart(2, "0");

  const [month, setMonth] = useState(`${year}-${defaultMM}`);
  const [drivers, setDrivers] = useState([]);
  const [assigned, setAssigned] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [allRes, asgRes] = await Promise.all([
          axios.get(`${backendURL}/admin/medical/get-drivers`, {
            withCredentials: true,
          }),
          axios.get(`${backendURL}/admin/medical/current-driver`, {
            params: { month },
            withCredentials: true,
          }),
        ]);

        // ✅ SAFE drivers handling
        const driversData = Array.isArray(allRes.data)
          ? allRes.data
          : allRes.data?.drivers || [];

        setDrivers(driversData);

        // ✅ SAFE assigned handling
        const assignedData = Array.isArray(asgRes.data?.drivers)
          ? asgRes.data.drivers
          : [];

        setAssigned(new Set(assignedData.map((d) => d._id)));

        setMessage("");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load data.");
        setDrivers([]);
        setAssigned(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  const toggle = (id) => {
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axios.post(
        `${backendURL}/admin/medical/assign-driver`,
        {
          month,
          driverIds: Array.from(assigned),
        },
        { withCredentials: true }
      );

      if (res.data.cleared) {
        setMessage(`Cleared assignment for ${month}`);
      } else {
        setMessage(
          `Assigned ${res.data.drivers?.length || 0} driver(s) for ${month}`
        );
      }
    } catch (err) {
      console.error(err);
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Assign Ambulance Drivers
      </h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Month</label>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const mm = String(i + 1).padStart(2, "0");
            const name = new Date(year, i).toLocaleString(
              "default",
              { month: "long" }
            );

            return (
              <option key={mm} value={`${year}-${mm}`}>
                {name} {year}
              </option>
            );
          })}
        </select>
      </div>

      {message && (
        <div className="mb-4 text-green-600 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <ul className="space-y-2 mb-6">
          {(drivers || []).map((d) => (
            <li key={d._id} className="flex items-center">
              <input
                type="checkbox"
                checked={assigned.has(d._id)}
                onChange={() => toggle(d._id)}
                className="mr-2"
              />

              <label className="flex-1">
                <span className="font-medium">{d?.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({d?.designation}) – {d?.mobile}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-teal-600 text-white rounded disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AmbulanceAssignmentPage;