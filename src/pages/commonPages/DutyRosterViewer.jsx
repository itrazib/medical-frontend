import React, { useEffect, useState } from "react";
import axios from "axios";

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const shifts = ["Morning", "Evening"];

const defaultDepartments = [
  "nurse and brother",
  "attendant",
  "pathology",
];

const DutyRosterViewer = () => {
  const [department, setDepartment] = useState(defaultDepartments[0]);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.VITE_API_BASE_URL;

  // Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/departments`, {
          withCredentials: true,
        });

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.departments || defaultDepartments;

        setDepartments(data);
      } catch {
        setDepartments(defaultDepartments);
      }
    };

    fetchDepartments();
  }, []);

  // Roster
  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendURL}/admin/medical/duty-roster`,
          {
            params: { department },
            withCredentials: true,
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.duties || [];

        setRoster(data);
      } catch {
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [department]);

  const getRosterForCell = (day, shift) => {
    return roster.filter(
      (item) => item.day === day && item.shift === shift
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700">
          🏥 Duty Roster Viewer
        </h1>
        <p className="text-gray-500 mt-1">
          Manage staff schedule by department
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex justify-center mb-6">
        <div className="bg-white shadow-md rounded-xl p-3 flex items-center gap-4">
          <label className="font-medium text-gray-700">
            Department:
          </label>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center text-gray-500">
          Loading roster...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px] bg-white rounded-2xl shadow-xl overflow-hidden border">

            {/* HEADER ROW */}
            <div className="grid grid-cols-8 bg-teal-600 text-white font-semibold">
              <div className="p-4">Shift / Day</div>
              {days.map((day) => (
                <div key={day} className="p-4 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* SHIFT ROWS */}
            {shifts.map((shift) => (
              <div
                key={shift}
                className="grid grid-cols-8 border-t"
              >
                {/* SHIFT LABEL */}
                <div className="p-4 bg-teal-50 font-semibold text-teal-700 flex items-center">
                  {shift}
                </div>

                {/* DAYS */}
                {days.map((day) => {
                  const items = getRosterForCell(day, shift);

                  return (
                    <div
                      key={`${day}-${shift}`}
                      className="p-2 border-l min-h-[130px] bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {items.length === 0 ? (
                        <div className="text-xs text-gray-400 italic">
                          No duty
                        </div>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item._id}
                            className="bg-white border rounded-lg p-2 mb-2 shadow-sm hover:shadow-md transition"
                          >
                            <div className="text-sm font-semibold text-gray-800">
                              👤 {item.staff?.name || "Unknown"}
                            </div>

                            <div className="text-xs text-gray-500">
                              {item.staff?.designation || "Staff"}
                            </div>

                            <div className="mt-1 text-xs">
                              <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded">
                                ⏰ {item.startTime} - {item.endTime}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyRosterViewer;