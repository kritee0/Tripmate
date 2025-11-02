import React, { useEffect, useState } from "react";
import api from "../../../utils/apiUtiles";
import Sidebar from "../tool/SideBar";
import { Table, Dropdown, Menu, Input, Checkbox, Modal, Button, Tag, message, Space } from "antd";
import { MoreVertical, Trash2 } from "lucide-react";

const AgencyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRefunded, setFilterRefunded] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/agency");
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/status`, { action });
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? data.data : b))
        );
        message.success(`Booking ${data.data.status.toLowerCase()} successfully`);
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating booking");
    }
  };

  const handleDelete = (booking) => {
    Modal.confirm({
      title: "Are you sure you want to delete this booking?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const { data } = await api.delete(`/bookings/${booking._id}`);
          if (data.success) {
            setBookings((prev) => prev.filter((b) => b._id !== booking._id));
            message.success("Booking deleted successfully");
          }
        } catch (error) {
          console.error(error);
          message.error("Error deleting booking");
        }
      },
    });
  };

  const displayedBookings = bookings
    .filter((b) =>
      (b.travelPackage?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((b) => (filterRefunded ? b.status === "Refunded" : true))
    .map((b) => ({ ...b, key: b._id }));

  const getStatusTag = (status) => {
    switch (status) {
      case "Refunded":
        return <Tag color="green">{status}</Tag>;
      case "Cancelled":
        return <Tag color="red">{status}</Tag>;
      case "Confirmed":
        return <Tag color="blue">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (id) => <span className="font-medium">{id}</span>,
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item disabled><strong>Name:</strong> {record.user?.name}</Menu.Item>
            <Menu.Item disabled><strong>Phone:</strong> {record.user?.phoneNumber}</Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" className="flex items-center gap-1">
              {record.user?.name || "N/A"}
              <MoreVertical size={14} />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Package",
      key: "package",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item disabled><strong>Package:</strong> {record.travelPackage?.name}</Menu.Item>
            <Menu.Item disabled><strong>Travellers:</strong> {record.numberOfTravellers}</Menu.Item>
            <Menu.Item disabled>
              <strong>Date:</strong>{" "}
              {new Date(record.bookingDate).toLocaleDateString()}
            </Menu.Item>
            <Menu.Item disabled><strong>Days:</strong> {record.travelPackage?.duration}</Menu.Item>
            <Menu.Item disabled><strong>Price:</strong> Rs {record.travelPackage?.price}</Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" className="flex items-center gap-1">
              {record.travelPackage?.name || "N/A"}
              <MoreVertical size={14} />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        const menu = (
          <Menu>
            {record.status !== "Refunded" && (
              <Menu.Item
                onClick={() => handleAction(record._id, "cancel")}
                style={{ color: "red" }}
              >
                Cancel
              </Menu.Item>
            )}
            <Menu.Item onClick={() => handleAction(record._id, "confirm")} style={{ color: "green" }}>
              Confirm
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDelete(record)}
              icon={<Trash2 size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreVertical size={18} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 sticky top-0 h-screen bg-white border-r shadow-sm">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold">My Bookings</h1>

          <Space direction="horizontal" wrap>
            <Input
              placeholder="Search by package name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
            <Checkbox
              checked={filterRefunded}
              onChange={() => setFilterRefunded(!filterRefunded)}
            >
              Show only refunded
            </Checkbox>
          </Space>
        </header>

        <div className="bg-white rounded-xl shadow-md border p-4">
          <Table
            columns={columns}
            dataSource={displayedBookings}
            loading={loading}
            scroll={{ x: true }}
            pagination={{ pageSize: 8 }}
            bordered
          />
        </div>
      </main>
    </div>
  );
};

export default AgencyBookings;
