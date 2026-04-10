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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depRes = await axios.get("/admin/medical/departments");

        if (Array.isArray(depRes.data)) {
          setDepartments(depRes.data);
        } else if (Array.isArray(depRes.data.departments)) {
          setDepartments(depRes.data.departments);
        } else {
          setDepartments(defaultDepartments);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
        setDepartments(defaultDepartments);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);

      try {
        const res = await axios.get("/admin/medical/duty-roster", {
          params: { department },
        });

        if (Array.isArray(res.data)) {
          setRoster(res.data);
        } else if (Array.isArray(res.data.duties)) {
          setRoster(res.data.duties);
        } else {
          setRoster([]);
        }
      } catch (err) {
        console.error("Failed to fetch roster:", err);
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [department]);

  const getRosterForCell = (day, shift) => {
    return Array.isArray(roster)
      ? roster.filter(
          (item) => item.day === day && item.shift === shift
        )
      : [];
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-poetsen text-center text-teal-700 mb-6">
        Duty Roster Viewer
      </h1>

      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="department" className="font-semibold text-gray-700">
            Select Department:
          </label>

          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {(Array.isArray(departments)
              ? departments
              : defaultDepartments
            ).map((dep) => (
              <option key={dep} value={dep}>
                {typeof dep === "string"
                  ? dep.charAt(0).toUpperCase() + dep.slice(1)
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading roster...</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-8 border border-gray-200 rounded-xl overflow-hidden shadow">
            {/* Top Left Empty Cell */}
            <div className="bg-gray-100 p-4"></div>

            {/* Day Headers */}
            {days.map((day) => (
              <div
                key={day}
                className="bg-teal-100 text-center font-semibold p-4 border-l border-gray-200"
              >
                {day}
              </div>
            ))}

            {/* Shift Rows */}
            {shifts.map((shift) => (
              <React.Fragment key={shift}>
                {/* Shift Name */}
                <div className="bg-teal-50 p-4 border-t border-gray-200 font-semibold text-gray-700">
                  {shift}
                </div>

                {/* Day Cells */}
                {days.map((day) => {
                  const cellItems = getRosterForCell(day, shift);

                  return (
                    <div
                      key={`${day}-${shift}`}
                      className="min-h-[120px] border-t border-l border-gray-200 p-2 bg-white"
                    >
                      {cellItems.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">
                          No duty assigned
                        </p>
                      ) : (
                        cellItems.map((item) => (
                          <div
                            key={item._id}
                            className="bg-teal-50 border border-teal-100 rounded-lg p-2 mb-2"
                          >
                            <p className="font-medium text-sm text-gray-800">
                              {item.staff?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-gray-600">
                              {item.staff?.designation || "Staff"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {item.startTime} - {item.endTime}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyRosterViewer;