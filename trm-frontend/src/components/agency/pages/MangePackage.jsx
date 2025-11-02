import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../tool/SideBar";
import PackageForm from "./PackageForm";
import { Plus, MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import { Table, Dropdown, Menu, Button, Modal, Spin, Image } from "antd";

const ManagePackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/packages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPackages(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this package?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:4000/api/packages/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
          toast.success("Package deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete package");
        }
      },
    });
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleView = (pkg) => {
    setViewingPackage(pkg);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price}`,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => handleView(record)}>
              View
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => handleEdit(record)}>
              Edit
            </Menu.Item>
            <Menu.Item
              key="delete"
              danger
              onClick={() => handleDelete(record._id)}
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
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 sticky top-0 h-screen bg-white shadow-sm border-r">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative p-6">
        <header className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-sm flex justify-between items-center py-3 mb-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Travel Packages</h1>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            className="bg-green-700 hover:bg-green-800"
            onClick={() => {
              setEditingPackage(null);
              setShowForm(true);
            }}
          >
            New Package
          </Button>
        </header>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border p-4">
          <Table
            columns={columns}
            dataSource={packages.map((pkg) => ({ ...pkg, key: pkg._id }))}
            loading={{
              spinning: loading,
              indicator: <Spin />,
            }}
            scroll={{ x: true }}
            pagination={{ pageSize: 8 }}
          />
        </div>

        {/* Form Modal */}
        <Modal
          open={showForm}
          onCancel={() => setShowForm(false)}
          title={editingPackage ? "Edit Package" : "Create Package"}
          footer={null}
          destroyOnClose
          width={700}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <PackageForm
            editingPackage={editingPackage}
            onSuccess={() => {
              fetchPackages();
              toast.success("Package saved successfully");
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>

        {/* View Modal */}
        <Modal
          open={!!viewingPackage}
          onCancel={() => setViewingPackage(null)}
          title={`Package Details - ${viewingPackage?.name || ""}`}
          footer={null}
          width={700}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {viewingPackage && (
            <div className="space-y-4 text-gray-700">
              {viewingPackage.imageUrl && (
                <Image
                  src={viewingPackage.imageUrl}
                  alt={viewingPackage.name}
                  className="rounded-lg"
                />
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <p>
                  <strong>Location:</strong> {viewingPackage.location}
                </p>
                <p>
                  <strong>Price:</strong> Rs. {viewingPackage.price}
                </p>
                <p>
                  <strong>Duration:</strong> {viewingPackage.duration}
                </p>
                <p>
                  <strong>Category:</strong> {viewingPackage.category}
                </p>
                <p>
                  <strong>Transport on Arrival:</strong>{" "}
                  {viewingPackage.transportAvailableOnArrival ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Agency:</strong> {viewingPackage.agency?.name || "-"}
                </p>
                <p>
                  <strong>Agency Location:</strong>{" "}
                  {viewingPackage.agency?.location || "-"}
                </p>
              </div>
              {viewingPackage.overview && (
                <p>
                  <strong>Overview:</strong> {viewingPackage.overview}
                </p>
              )}
            </div>
          )}
        </Modal>

        {/* Floating Add Button */}
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<Plus size={22} />}
          className="!bg-green-700 hover:!bg-green-800 fixed bottom-8 right-8 shadow-lg"
          onClick={() => {
            setEditingPackage(null);
            setShowForm(true);
          }}
        />
      </main>
    </div>
  );
};

export default ManagePackage;
