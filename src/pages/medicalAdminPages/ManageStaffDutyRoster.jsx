
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

const timeMap = {
  Morning: { startTime: "8:00 am", endTime: "2:00 pm" },
  Evening: { startTime: "2:00 pm", endTime: "8:00 pm" },
};

const departments = ["nurse and brother", "attendant", "pathology"];

const ManageStaffDutyRoster = () => {
  const [department, setDepartment] = useState(departments[0]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [errorStaff, setErrorStaff] = useState(null);

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStaff(true);
      setErrorStaff(null);

      try {
        const staffRes = await axios.get(
          `${backendURL}/admin/medical/medical-users`,
          {
            params: { department },
            withCredentials: true,
          }
        );

        console.log("Staff Response:", staffRes.data);

        // Ensure staff is always an array
        if (Array.isArray(staffRes.data)) {
          setStaff(staffRes.data);
        } else if (Array.isArray(staffRes.data.staff)) {
          setStaff(staffRes.data.staff);
        } else if (Array.isArray(staffRes.data.users)) {
          setStaff(staffRes.data.users);
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.error(err);
        setErrorStaff("Failed to load staff.");
        setStaff([]);
        setLoadingStaff(false);
        return;
      }

      try {
        const dutyRes = await axios.get(
          `${backendURL}/admin/medical/duty-roster`,
          {
            params: { department },
            withCredentials: true,
          }
        );

        console.log("Duty Response:", dutyRes.data);

        const dutyData = Array.isArray(dutyRes.data)
          ? dutyRes.data
          : dutyRes.data.dutyRoster || [];

        const initAssign = {};

        dutyData.forEach((item) => {
          const key = `${item.day}___${item.shift}`;

          if (!initAssign[key]) {
            initAssign[key] = [];
          }

          initAssign[key].push(item);
        });

        setAssignments(initAssign);
      } catch (err) {
        console.error(err);
        setErrorStaff("Failed to load duty roster.");
      }

      setLoadingStaff(false);
    };

    fetchData();
  }, [department]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === "STAFF_LIST" &&
      destination.droppableId !== "STAFF_LIST"
    ) {
      const [day, shift] = destination.droppableId.split("___");
      const times = timeMap[shift] || timeMap.Morning;

      try {
        const res = await axios.post(
          `${backendURL}/admin/medical/duty-roster/add`,
          {
            staff: draggableId,
            department,
            day,
            shift,
            ...times,
          },
          {
            withCredentials: true,
          }
        );

        const newRecord = res.data;

        setAssignments((prev) => {
          const key = destination.droppableId;
          const existing = prev[key] || [];

          return {
            ...prev,
            [key]: [...existing, newRecord],
          };
        });
      } catch (err) {
        console.error(
          "Failed to add duty:",
          err.response?.data || err.message
        );
      }
    }
  };

  const handleRemove = async (assignId, cellId) => {
    try {
      await axios.post(
        `${backendURL}/admin/medical/duty-roster/delete/${assignId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setAssignments((prev) => {
        const updated = { ...prev };

        updated[cellId] = updated[cellId].filter(
          (a) => a._id !== assignId
        );

        return updated;
      });
    } catch (err) {
      console.error("Failed to remove duty:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-6 text-center">
        Staff Duty Roster Management
      </h1>

      <div className="mb-6 flex justify-center items-center gap-2">
        <label htmlFor="department" className="font-semibold">
          Select Department:
        </label>

        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row gap-6">
          <Droppable droppableId="STAFF_LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full lg:w-64 bg-teal-50 rounded-lg p-4 shadow-md"
              >
                <h2 className="text-lg font-semibold mb-3 capitalize">
                  {department} Staff
                </h2>

                {loadingStaff && (
                  <p className="text-gray-500">Loading staff...</p>
                )}

                {errorStaff && (
                  <p className="text-red-500 text-sm">{errorStaff}</p>
                )}

                {!loadingStaff && staff.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No staff found for this department.
                  </p>
                )}

                {Array.isArray(staff) &&
                  staff.map((stf, idx) => (
                    <Draggable
                      key={stf._id}
                      draggableId={stf._id}
                      index={idx}
                    >
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="bg-white p-3 rounded shadow mb-2 cursor-pointer"
                        >
                          <div className="font-medium">{stf.name}</div>
                          <div className="text-xs text-gray-500">
                            {stf.designation || stf.role}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-8 min-w-[1000px] border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 font-bold"></div>

              {days.map((day) => (
                <div
                  key={day}
                  className="bg-teal-100 p-3 font-bold text-center border-l"
                >
                  {day}
                </div>
              ))}

              {shifts.map((shift) => (
                <React.Fragment key={shift}>
                  <div className="bg-teal-50 p-3 border-t font-semibold">
                    <div>{shift}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {timeMap[shift].startTime} - {timeMap[shift].endTime}
                    </div>
                  </div>

                  {days.map((day) => {
                    const cellId = `${day}___${shift}`;
                    const cellItems = assignments[cellId] || [];

                    return (
                      <Droppable key={cellId} droppableId={cellId}>
                        {(prov, snapshot) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.droppableProps}
                            className={`min-h-[100px] p-2 border-t border-l ${
                              snapshot.isDraggingOver
                                ? "bg-green-50"
                                : "bg-white"
                            }`}
                          >
                            {cellItems.map((rec) => (
                              <div
                                key={rec._id}
                                className="bg-teal-50 rounded p-2 mb-2 flex justify-between items-center"
                              >
                                <span className="text-sm font-medium">
                                  {rec.staff?.name || "Unknown Staff"}
                                </span>

                                <button
                                  onClick={() =>
                                    handleRemove(rec._id, cellId)
                                  }
                                  className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}

                            {prov.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ManageStaffDutyRoster;
