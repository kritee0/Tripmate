import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Button,
  Select,
  Input,
  Space,
  Dropdown,
  message,
  Popconfirm,
} from "antd";
import { DownOutlined, EditOutlined, DeleteOutlined, PoweroffOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users?.filter((u) => u && u._id) || []);
    } catch (err) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle status
  const toggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(
        `/api/auth/${userId}/status`,
        { status: currentStatus === "active" ? "inactive" : "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Status updated successfully");
      fetchUsers();
    } catch {
      message.error("Failed to update status");
    }
  };

  // Update role
  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(
        `/api/auth/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch {
      message.error("Failed to update role");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/auth/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  // Filter users
  const filteredUsers = users
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => (roleFilter === "All" ? true : u.role === roleFilter))
    .filter((u) => (statusFilter === "All" ? true : u.status === statusFilter));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "User", value: "User" },
        { text: "TravelAgency", value: "TravelAgency" },
        { text: "Admin", value: "Admin" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role, record) => (
        <Select
          value={role}
          size="small"
          style={{ width: 140 }}
          onChange={(newRole) => updateRole(record._id, newRole)}
        >
          <Option value="User">User</Option>
          <Option value="TravelAgency">TravelAgency</Option>
          <Option value="Admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: (
              <Button
                type="text"
                icon={<PoweroffOutlined />}
                onClick={() => toggleStatus(record._id, record.status)}
              >
                {record.status === "active" ? "Deactivate" : "Activate"}
              </Button>
            ),
          },
          {
            key: "2",
            label: (
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => deleteUser(record._id)}
              >
                <Button danger type="text" icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            ),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <Space wrap>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160 }}
          >
            <Option value="All">All Roles</Option>
            <Option value="User">User</Option>
            <Option value="TravelAgency">TravelAgency</Option>
            <Option value="Admin">Admin</Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="All">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers.map((u) => ({ ...u, key: u._id }))}
        loading={loading}
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default ManageUsers;
