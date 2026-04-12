import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import DispenseDetail from "./component/DispenseDetail";

const DispenseMedicine = () => {
  const [records, setRecords] = useState([]); // ✅ safe
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    fetchRecords();

    const socket = io();

    socket.on("new-dispense-request", () => {
      fetchRecords();
      if (filter !== "pending") {
        setNewCount((c) => c + 1);
      }
    });

    return () => socket.disconnect();
  }, [filter, dateFilter, page]);

  async function fetchRecords() {
    try {
      const params = { page, limit };

      if (filter !== "all") params.status = filter;
      if (dateFilter) params.date = dateFilter;

      const res = await axios.get(
        `${backendURL}/medical-staff/dispense-records`,
        {withCredentials: true, params},
      );

      const data = res.data;

      // 🔥 SAFE FIX
      const safeRecords = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setRecords(safeRecords);

      const totalCount =
        parseInt(res.headers["x-total-count"], 10) ||
        safeRecords.length;

      setTotalPages(Math.ceil(totalCount / limit));

      if (selected) {
        const updated = safeRecords.find(
          (r) => r._id === selected._id
        );
        setSelected(updated || null);
      }
    } catch (err) {
      console.log(err);
      setRecords([]); // 🔥 prevent crash
    }
  }

  function selectTab(tab) {
    setFilter(tab);
    setPage(1);
    setSelected(null);
    if (tab === "pending" || tab === "all") setNewCount(0);
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-3xl text-center mb-10">
        Dispense Records
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`px-3 py-1 rounded border ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
            setSelected(null);
          }}
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {(records || []).map((rec) => (
            <div
              key={rec._id}
              onClick={() => setSelected(rec)}
              className="p-4 bg-white shadow cursor-pointer"
            >
              <p>
                Rx #{rec.prescription?.slice?.(-6) || "N/A"}
              </p>
              <p>{rec.patient?.name}</p>
              <p>{rec.doctor?.name}</p>
            </div>
          ))}

          {/* PAGINATION */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <span>
              {page}/{totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* DETAIL */}
        <div className="lg:col-span-2 hidden lg:block">
          {selected ? (
            <DispenseDetail
              record={selected}
              onUpdate={fetchRecords}
            />
          ) : (
            <p>Select a record</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispenseMedicine;