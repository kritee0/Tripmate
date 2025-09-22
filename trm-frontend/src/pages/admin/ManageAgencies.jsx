import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/apiUtiles";
import Loader from "../../components/common/Loader";

const ManageAgencies = () => {
  const { isAdmin } = useAuth();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState({ id: null, show: false });

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agency-applications");
      setAgencies(res.data.applications || []);
    } catch (err) {
      console.error("Error fetching agencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchAgencies();
  }, [isAdmin]);

  const changeStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await api.patch(`/agency-applications/${id}/status`, { status });
      fetchAgencies();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteAgency = (id) => setDeleteMessage({ id, show: true });
  const cancelDelete = () => setDeleteMessage({ id: null, show: false });

  const deleteAgency = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/agency-applications/${id}`);
      setDeleteMessage({ id: null, show: false });
      fetchAgencies();
    } catch (err) {
      console.error("Error deleting agency:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return <p className="text-red-500 font-semibold">Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Manage Agencies
      </h2>

      {loading ? (
        <Loader fullscreen={false} />
      ) : agencies.length === 0 ? (
        <p className="text-center text-gray-600">No agencies found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-green-900 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left border-b">Agency Name</th>
                <th className="px-4 py-3 text-left border-b">Email</th>
                <th className="px-4 py-3 text-left border-b">License</th>
                <th className="px-4 py-3 text-left border-b">Documents</th>
                <th className="px-4 py-3 text-left border-b">Status</th>
                <th className="px-4 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr
                  key={agency._id}
                  className="hover:bg-gray-50 transition-all relative"
                >
                  <td className="px-4 py-3 border-b">{agency.agencyName}</td>
                  <td className="px-4 py-3 border-b">{agency.agencyEmail}</td>
                  <td className="px-4 py-3 border-b">{agency.licenseNumber}</td>
                  <td className="px-4 py-3 border-b flex gap-2">
                    {agency.documents && agency.documents.length > 0 ? (
                      agency.documents.map((doc, i) => {
                        const isImage = /\.(jpg|jpeg|png)$/i.test(doc);
                        const isPdf = /\.pdf$/i.test(doc);
                        return (
                          <button
                            key={i}
                            onClick={() =>
                              setSelectedDoc(`http://localhost:4000/uploads/${doc}`)
                            }
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <Eye size={14} />
                            {isImage ? "Image" : isPdf ? "PDF" : "File"}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-gray-200">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agency.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : agency.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {agency.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b flex flex-wrap gap-2">
                    {agency.status !== "Approved" && (
                      <button
                        onClick={() => changeStatus(agency._id, "Approved")}
                        disabled={actionLoading === agency._id}
                        className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        <CheckCircle size={14} />
                        {actionLoading === agency._id ? "Updating..." : "Approve"}
                      </button>
                    )}
                    {agency.status !== "Rejected" && (
                      <button
                        onClick={() => changeStatus(agency._id, "Rejected")}
                        disabled={actionLoading === agency._id}
                        className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
                      >
                        <XCircle size={14} />
                        {actionLoading === agency._id ? "Updating..." : "Reject"}
                      </button>
                    )}

                    {deleteMessage.show && deleteMessage.id === agency._id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteAgency(agency._id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDeleteAgency(agency._id)}
                        disabled={actionLoading === agency._id}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded-xl relative max-w-3xl w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedDoc(null)}
            >
              ✕
            </button>
            {selectedDoc.endsWith(".pdf") ? (
              <iframe
                src={selectedDoc}
                className="w-full h-96"
                title="PDF Viewer"
              ></iframe>
            ) : (
              <img
                src={selectedDoc}
                alt="Document"
                className="w-full h-auto rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgencies;

