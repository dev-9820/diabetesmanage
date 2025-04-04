import { useEffect, useState } from "react";
import axios from "axios";

export default function CRM() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("https://diabetesbackend.onrender.com/api/consultations");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`https://diabetesbackend.onrender.com/api/consultations/${id}`);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error("Error deleting record", error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Consultations</h1>
      <table className="w-full border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 border border-gray-600">Name</th>
            <th className="p-3 border border-gray-600">Contact</th>
            <th className="p-3 border border-gray-600">Place</th>
            <th className="p-3 border border-gray-600">Diabetes Duration</th>
            <th className="p-3 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app._id} className="border border-gray-600">
              <td className="p-3 border border-gray-600">{app.name}</td>
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
