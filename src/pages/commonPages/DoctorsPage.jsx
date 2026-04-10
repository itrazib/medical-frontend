import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/doctors`);

        console.log(res.data);

        // যদি API doctors property return করে
        setDoctors(res.data.doctors || []);

        // যদি API direct array return করে, তাহলে এটা use করবেন:
        // setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 px-4 py-10">
      <h2 className="text-3xl text-center text-teal-500 font-poetsen mb-10">
        Our Doctors
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {doctors.map((doctor) => (
          console.log(doctor.photo),
          <div
            key={doctor._id}
            className="bg-white shadow rounded-2xl overflow-hidden transition hover:shadow-lg border"
          >
            <img
              className="w-full h-60 object-cover"
              src={doctor.photo}
              alt={doctor.name}
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#0e7660] mb-1">
                {doctor.name}
              </h3>

              <p className="text-sm text-gray-700">MBBS</p>
              <p className="text-sm text-gray-700">
                {doctor.designation_2}
              </p>
              <p className="text-sm text-gray-700">{doctor.office}</p>
              <p className="text-sm text-gray-700">
                Mawlana Bhashani Science and Technology University
              </p>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Phone:</span> {doctor.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {doctor.emails?.[0]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;