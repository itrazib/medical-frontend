import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyDispenseReport() {
  const today = new Date();
  const backendURL = import.meta.env.VITE_API_BASE_URL;

  const defaultStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )
    .toISOString()
    .slice(0, 10);

  const defaultEnd = today.toISOString().slice(0, 10);

  const [range, setRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  });

  const [data, setData] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);

      try {
        const resp = await axios.get(
          `${backendURL}/medical-staff/dispensed-report`,
          {
            withCredentials: true,
            params: {
              start: range.start,
              end: range.end,
            },
          }
        );

        const resData = resp.data;

        // 🔥 SAFE NORMALIZATION (MOST IMPORTANT FIX)
        const safeData = Array.isArray(resData)
          ? resData
          : Array.isArray(resData?.data)
          ? resData.data
          : [];

        setData(safeData);
      } catch (err) {
        console.error("Report fetch error:", err);
        setError("Failed to load report");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [range, backendURL]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Monthly Dispensed Stock
      </h2>

      {/* ERROR / LOADING */}
      {loading && (
        <p className="text-blue-500 mb-4">Loading report...</p>
      )}

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* DATE FILTER */}
      <div className="flex space-x-6 mb-8">
        <div>
          <label className="text-sm">Start Date</label>
          <input
            type="date"
            value={range.start}
            onChange={(e) =>
              setRange((r) => ({
                ...r,
                start: e.target.value,
              }))
            }
            className="border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm">End Date</label>
          <input
            type="date"
            value={range.end}
            onChange={(e) =>
              setRange((r) => ({
                ...r,
                end: e.target.value,
              }))
            }
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* CHART */}
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="dispensedQuantity"
              fill="#00aa99"
              name="Dispensed"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Medicine</th>
              <th className="border p-2 text-left">Dispensed</th>
              <th className="border p-2 text-left">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {(data || []).length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-4 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((m, idx) => (
                <tr key={m.medicineId || idx}>
                  <td className="border p-2">
                    {m.name || "N/A"}
                  </td>
                  <td className="border p-2">
                    {m.dispensedQuantity ?? 0}
                  </td>
                  <td className="border p-2">
                    {m.remainingMonthlyStock ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}