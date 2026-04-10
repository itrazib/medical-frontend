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

const ManageTelemedicineRoster = () => {
  const [doctors, setDoctors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/admin/medical/telemedicine-duty`,
          { withCredentials: true }
        );

        const duties = Array.isArray(res.data?.duties)
          ? res.data.duties
          : [];

        const doctorsData = Array.isArray(res.data?.doctors)
          ? res.data.doctors
          : [];

        setDoctors(doctorsData);

        const initial = {};

        duties.forEach((item) => {
          const key = item.day;

          if (!initial[key]) {
            initial[key] = [];
          }

          initial[key].push(item);
        });

        setAssignments(initial);
      } catch (err) {
        console.error("Error fetching telemedicine duties:", err);
        setDoctors([]);
        setAssignments({});
      }
    };

    fetchData();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === "DOCTOR_LIST" &&
      destination.droppableId !== "DOCTOR_LIST"
    ) {
      const day = destination.droppableId;

      try {
        const res = await axios.post(
          `${backendURL}/admin/medical/telemedicine-duty/add`,
          {
            doctor: draggableId,
            day,
          },
          { withCredentials: true }
        );

        const newRecord = res.data;

        setAssignments((prev) => {
          const existing = prev[day] || [];
          return {
            ...prev,
            [day]: [...existing, newRecord],
          };
        });
      } catch (err) {
        console.error("Failed to add telemedicine duty:", err.response?.data);
      }
    }
  };

  const handleRemove = async (assignId, day) => {
    try {
      await axios.post(
        `${backendURL}/admin/medical/telemedicine-duty/delete/${assignId}`,
        {},
        { withCredentials: true }
      );

      setAssignments((prev) => {
        const updated = { ...prev };
        updated[day] = (updated[day] || []).filter(
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
      <h1 className="text-2xl sm:text-3xl font-poetsen text-teal-700 mb-6 text-center">
        Telemedicine Duty Roster
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Doctor List */}
          <Droppable droppableId="DOCTOR_LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full lg:w-48 p-4 bg-teal-50 rounded-lg shadow-inner mb-6 lg:mb-0 max-h-[70vh] overflow-auto"
              >
                <h2 className="font-semibold mb-3">Doctors</h2>

                {(doctors || []).map((doc, idx) => (
                  <Draggable
                    key={doc._id}
                    draggableId={doc._id}
                    index={idx}
                  >
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-3 mb-2 bg-white rounded cursor-move shadow"
                      >
                        {doc?.name || "Unknown"}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Days */}
          <div className="flex-1 overflow-auto max-h-[80vh]">
            <div className="border rounded-lg divide-y">
              {days.map((day) => {
                const cellItems = assignments[day] || [];

                return (
                  <Droppable
                    droppableId={day}
                    key={day}
                    direction="horizontal"
                  >
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.droppableProps}
                        className={`flex flex-col sm:flex-row p-4 gap-3 ${
                          snapshot.isDraggingOver
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="w-32 font-semibold">{day}</div>

                        <div className="flex flex-wrap gap-2">
                          {cellItems.length === 0 && (
                            <span className="text-gray-400 text-sm">
                              No doctors assigned
                            </span>
                          )}

                          {(cellItems || []).map((rec) => (
                            <div
                              key={rec._id}
                              className="flex items-center bg-teal-100 px-3 py-1 rounded"
                            >
                              <span className="mr-2">
                                {rec.doctor?.name || "Unknown"}
                              </span>

                              <button
                                onClick={() =>
                                  handleRemove(rec._id, day)
                                }
                                className="text-red-600 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {prov.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ManageTelemedicineRoster;