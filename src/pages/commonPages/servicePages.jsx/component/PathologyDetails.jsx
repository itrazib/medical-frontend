import React, { useEffect, useState } from "react";
import axios from "axios";

const PathologyDetails = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/pathology-tests`);

        console.log(response.data);

        // যদি API direct array return করে
        if (Array.isArray(response.data)) {
          setTests(response.data);
        }
        // যদি API object এর ভিতরে tests property return করে
        else if (Array.isArray(response.data.tests)) {
          setTests(response.data.tests);
        }
        // অন্য কিছু হলে empty array
        else {
          setTests([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load pathology tests.");
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading pathology tests...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <>
      <p className="mb-4 text-gray-700">
        The Pathology Department at MBSTU Medical Center provides diagnostic
        services through lab tests and blood sample collection.
      </p>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        🧪 Blood/Sample Collection Time
      </h4>

      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Morning: 8:00 AM – 12:00 PM</li>
        <li>Evening: 2:00 PM – 6:00 PM</li>
      </ul>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        🔬 Available Tests
      </h4>

      <ul className="list-disc list-inside mb-4 text-gray-700">
        {tests.length === 0 ? (
          <li>No tests available currently.</li>
        ) : (
          (Array.isArray(tests) ? tests : []).map((test) => (
            <li key={test._id} className="mb-1">
              <strong>{test.name}</strong>
            </li>
          ))
        )}
      </ul>

      <h4 className="font-semibold text-lg text-teal-700 mb-2">
        📞 Contact Numbers
      </h4>

      <ul className="list-disc list-inside text-gray-700">
        <li>Shahoriyar Khan : 01700-614613</li>
        <li>Md. Mostafizur Rahman : 01751-457683</li>
      </ul>
    </>
  );
};

export default PathologyDetails;