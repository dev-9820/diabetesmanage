import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function CRM() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [dayFilter, setDayFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("https://diabetesbackend.onrender.com/api/consultations");
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`https://diabetesbackend.onrender.com/api/consultations/${id}`);
      const updated = appointments.filter(app => app._id !== id);
      setAppointments(updated);
      setFilteredAppointments(updated);
    } catch (error) {
      console.error("Error deleting record", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    if (dayFilter) {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfToday.getDate() - 1);

      filtered = filtered.filter(app => {
        const createdAt = new Date(app.createdAt);
        if (dayFilter === "today") {
          return createdAt >= startOfToday;
        } else if (dayFilter === "yesterday") {
          return createdAt >= startOfYesterday && createdAt < startOfToday;
        }
        return true;
      });
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      filtered = filtered.filter(app => {
        const createdAt = new Date(app.createdAt);
        return createdAt >= from && createdAt <= to;
      });
    }

    setFilteredAppointments(filtered);
  };

  const exportToExcel = () => {
    const data = filteredAppointments.map((app, index) => ({
      "Sr No": index + 1,
      "Date": new Date(app.createdAt).toLocaleDateString(),
      "Time": new Date(app.createdAt).toLocaleTimeString(),
      "Name": app.name,
      "Contact": app.contact,
      "Place": app.place,
      "Diabetes Duration": app.duration,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultations");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Consultations</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-800 p-4 rounded-lg">
        <select
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md border border-gray-500"
        >
          <option value="">Filter by Day</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md border border-gray-500"
        />
        <span className="text-white">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md border border-gray-500"
        />

        <button
          onClick={applyFilters}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
        >
          Apply Filters
        </button>

        <button
          onClick={exportToExcel}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md ml-auto"
        >
          Download Excel
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-3 border border-gray-600">Sr. No</th>
            <th className="p-3 border border-gray-600">Date & Time</th>
            <th className="p-3 border border-gray-600">Name</th>
            <th className="p-3 border border-gray-600">Email</th>
            <th className="p-3 border border-gray-600">Contact</th>
            <th className="p-3 border border-gray-600">Place</th>
            <th className="p-3 border border-gray-600">Diabetes Duration</th>
            <th className="p-3 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((app, index) => (
            <tr key={app._id} className="border border-gray-600">
              <td className="p-3 border border-gray-600">{index + 1}</td>
              <td className="p-3 border border-gray-600">
                {new Date(app.createdAt).toLocaleDateString()}
                <br />
                <span className="text-sm text-gray-400">
                  {new Date(app.createdAt).toLocaleTimeString()}
                </span>
              </td>
              <td className="p-3 border border-gray-600">{app.name}</td>
              <td className="p-3 border border-gray-600">{app.email}</td>
        
              <td className="p-3 border border-gray-600">{app.contact}</td>
              <td className="p-3 border border-gray-600">{app.place}</td>
              <td className="p-3 border border-gray-600">{app.duration}</td>
              <td className="p-3 border border-gray-600">
                <button
                  onClick={() => deleteAppointment(app._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
