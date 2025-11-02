// src/pages/admin/ManageAgencies.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Dropdown,
  Modal,
  Space,
  message,
} from "antd";
import { MoreOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../../utils/apiUtiles";
import { useAuth } from "../../context/AuthContext";

const { Search } = Input;
const { Option } = Select;

const ManageAgencies = () => {
  const { isAdmin } = useAuth();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    id: null,
    type: "",
  });

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agency-applications");
      setAgencies(res.data.applications || []);
      setFilteredAgencies(res.data.applications || []);
    } catch (err) {
      console.error("Error fetching agencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchAgencies();
  }, [isAdmin]);

  const handleSearch = (value) => {
    const filtered = agencies.filter(
      (agency) =>
        agency.agencyName.toLowerCase().includes(value.toLowerCase()) ||
        agency.agencyEmail.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAgencies(filtered);
  };

  const handleFilter = (status) => {
    if (status === "All") return setFilteredAgencies(agencies);
    setFilteredAgencies(agencies.filter((a) => a.status === status));
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/agency-applications/${id}/status`, { status });
      message.success(`Agency ${status.toLowerCase()} successfully`);
      fetchAgencies();
    } catch (err) {
      message.error("Error updating status");
    }
  };

  const deleteAgency = async (id) => {
    try {
      await api.delete(`/agency-applications/${id}`);
      message.success("Agency deleted");
      fetchAgencies();
    } catch (err) {
      message.error("Error deleting agency");
    }
  };

  if (!isAdmin)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">
        Access denied. Admins only.
      </p>
    );

  const columns = [
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      key: "agencyName",
    },
    {
      title: "Email",
      dataIndex: "agencyEmail",
      key: "agencyEmail",
    },
    {
      title: "License",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Documents",
      key: "documents",
      render: (_, agency) =>
        agency.documents?.length > 0 ? (
          <Space wrap>
            {agency.documents.map((doc, i) => {
              const isPdf = doc.toLowerCase().endsWith(".pdf");
              const label = isPdf ? "PDF" : "Image";
              return (
                <Button
                  key={i}
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() =>
                    setSelectedDoc(`http://localhost:4000/uploads/${doc}`)
                  }
                >
                  {label}
                </Button>
              );
            })}
          </Space>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Approved"
            ? "green"
            : status === "Rejected"
            ? "red"
            : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, agency) => {
        const menuItems = [
          agency.status !== "Approved" && {
            key: "approve",
            label: "Approve",
            onClick: () =>
              setConfirmAction({ show: true, id: agency._id, type: "approve" }),
          },
          agency.status !== "Rejected" && {
            key: "reject",
            label: "Reject",
            onClick: () =>
              setConfirmAction({ show: true, id: agency._id, type: "reject" }),
          },
          {
            key: "delete",
            label: <span className="text-red-500">Delete</span>,
            onClick: () =>
              setConfirmAction({ show: true, id: agency._id, type: "delete" }),
          },
        ].filter(Boolean);

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Manage Agencies</h2>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Search
            placeholder="Search by name or email"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            defaultValue="All"
            style={{ width: 150 }}
            onChange={handleFilter}
          >
            <Option value="All">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAgencies}
        rowKey="_id"
        bordered
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 8 }}
      />

      {/* Document Modal */}
      <Modal
        open={!!selectedDoc}
        title="Document Viewer"
        onCancel={() => setSelectedDoc(null)}
        footer={null}
        width={800}
        centered
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {selectedDoc?.endsWith(".pdf") ? (
          <iframe
            src={selectedDoc}
            title="PDF Viewer"
            width="100%"
            height="500px"
          />
        ) : (
          <img
            src={selectedDoc}
            alt="Document"
            className="w-full rounded-md border"
          />
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        open={confirmAction.show}
        title="Confirm Action"
        onCancel={() => setConfirmAction({ show: false, id: null, type: "" })}
        onOk={async () => {
          if (confirmAction.type === "approve")
            await changeStatus(confirmAction.id, "Approved");
          else if (confirmAction.type === "reject")
            await changeStatus(confirmAction.id, "Rejected");
          else if (confirmAction.type === "delete")
            await deleteAgency(confirmAction.id);

          setConfirmAction({ show: false, id: null, type: "" });
        }}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to{" "}
          <b>
            {confirmAction.type === "approve"
              ? "approve"
              : confirmAction.type === "reject"
              ? "reject"
              : "delete"}
          </b>{" "}
          this agency?
        </p>
      </Modal>
    </div>
  );
};

export default ManageAgencies;
