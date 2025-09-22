// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/auth", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `/api/users/${userId}/status`,
        { status: currentStatus === "active" ? "inactive" : "active" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showMessage("success", "Status updated successfully");
      fetchUsers();
    } catch {
      showMessage("error", "Failed to update status");
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showMessage("success", `Role updated to ${newRole}`);
      fetchUsers();
    } catch {
      showMessage("error", "Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showMessage("success", "User deleted successfully");
      fetchUsers();
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>

      {message.text && (
        <div
          className={`p-2 mb-4 rounded ${
            message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="User">User</option>
                  <option value="TravelAgency">TravelAgency</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded ${
                    u.status === "active"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => toggleStatus(u._id, u.status)}
                  className={`px-3 py-1 rounded ${
                    u.status === "active" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {u.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;



