import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useNavigate } from "react-router";

export default function ManageMedicinePage() {
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const [medicines, setMedicines] = useState([]); // ✅ safe init
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  const backendURL = import.meta.env.VITE_API_BASE_URL ;

  const pageSize = 10;
  const lowStockThreshold = 5;

  // Fetch medicines
  const fetchMedicines = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", pageSize);

    try {
      const res = await axios.get(
        `${backendURL}/medical-staff/medicines?${params.toString()}`,
        { withCredentials: true }
      );

      const data = res.data;

      // ✅ SAFE fallback
      setMedicines(data?.items ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setError(null);
    } catch (err) {
      setError(err.message || "Error fetching medicines");
      setMedicines([]); // ✅ prevent crash
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Search suggestions
  const loadSearchOptions = async (input) => {
    if (!input) return [];
    try {
      const { data } = await axios.get(
        `${backendURL}/medical-staff/search-medicine?query=${encodeURIComponent(input)}`,
        { withCredentials: true }
      );
      return data || [];
    } catch {
      return [];
    }
  };

  // Filter stock
  const displayedMeds = (medicines || []).filter((med) => {
    if (stockFilter === "low") {
      return med.monthlyStockQuantity > 0 &&
        med.monthlyStockQuantity <= lowStockThreshold;
    }
    if (stockFilter === "out") {
      return med.monthlyStockQuantity === 0;
    }
    return true;
  });

  const openModal = (medicine) => {
    setCurrentMed(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMed(null);
  };

  // Update stock
  const handleUpdate = async (e) => {
    e.preventDefault();

    const { addedQuantity, expiryDate } = Object.fromEntries(
      new FormData(e.target)
    );

    const increment = parseInt(addedQuantity, 10) || 0;

    const updatedStock =
      (currentMed?.monthlyStockQuantity || 0) + increment;

    try {
      await axios.put(
        `${backendURL}/medical-staff/medicines/${currentMed._id}`,
        {
          monthlyStockQuantity: updatedStock,
          expiryDate,
        },
        { withCredentials: true }
      );

      closeModal();
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;

    try {
      await axios.delete(`${backendURL}/medical-staff/medicines/${id}`, {
        withCredentials: true
      });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">

      {/* SEARCH + FILTER */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 ml-20">
          <AsyncCreatableSelect
            ref={selectRef}
            cacheOptions
            defaultOptions
            loadOptions={loadSearchOptions}
            inputValue={inputValue}
            menuIsOpen={menuIsOpen}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            onInputChange={(val, { action }) => {
              if (action === "input-change") {
                setInputValue(val);
                setMenuIsOpen(true);
              }
            }}
            onChange={(opt) => {
              const val = opt?.value || "";
              setSearch(val);
              setInputValue(val);
              setPage(1);
              setMenuIsOpen(false);
            }}
            onCreateOption={(input) => {
              setSearch(input);
              setInputValue(input);
              setPage(1);
              setMenuIsOpen(false);
            }}
            placeholder="Search medicine..."
          />
        </div>

        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedMeds.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th>Name</th>
                <th>Generic</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {displayedMeds.map((med) => (
                <tr key={med._id}>
                  <td
                    className="text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/medical-staff/medicines/${med._id}`)
                    }
                  >
                    {med.name}
                  </td>
                  <td>{med.genericName}</td>
                  <td>{med.type}</td>
                  <td>{med.monthlyStockQuantity}</td>
                  <td>
                    {med.expiryDate
                      ? new Date(med.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => openModal(med)}>
                      <PencilIcon size={18} />
                    </button>
                    <button onClick={() => handleDelete(med._id)}>
                      <TrashIcon size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded w-96">
            <Dialog.Title>Update Medicine</Dialog.Title>

            {currentMed && (
              <form onSubmit={handleUpdate}>
                <input
                  name="addedQuantity"
                  type="number"
                  defaultValue={0}
                  className="border w-full"
                />

                <input
                  name="expiryDate"
                  type="date"
                  defaultValue={
                    currentMed.expiryDate
                      ? currentMed.expiryDate.split("T")[0]
                      : ""
                  }
                  className="border w-full mt-2"
                />

                <button type="submit" className="bg-blue-600 text-white mt-3">
                  Save
                </button>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}