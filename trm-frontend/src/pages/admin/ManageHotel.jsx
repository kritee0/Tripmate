import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Input, Select, Button, Modal, Space, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import HotelForm from "../admin/HotelForm";

const { Option } = Select;

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [formData, setFormData] = useState({
    placeId: "",
    name: "",
    description: "",
    image: null,
    address: "",
    contact: "",
    priceRange: "",
    amenities: [""],
    roomFeatures: [""],
    lat: "",
    long: "",
  });
  const [search, setSearch] = useState("");
  const [filterPlace, setFilterPlace] = useState("");

  const API_URL = "http://localhost:4000/api/hotels";
  const PLACE_API_URL = "http://localhost:4000/api/places";

  // Fetch Hotels
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHotels(res.data);
      setFilteredHotels(res.data);
    } catch (err) {
      message.error("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Places
  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(PLACE_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaces(res.data);
    } catch (err) {
      console.error("Failed to fetch places", err);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchPlaces();
  }, []);

  // Filters
  useEffect(() => {
    let filtered = hotels;
    if (search) {
      filtered = filtered.filter((hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPlace) {
      filtered = filtered.filter((hotel) => hotel.placeId?._id === filterPlace);
    }
    setFilteredHotels(filtered);
  }, [search, filterPlace, hotels]);

  const resetForm = () => {
    setFormData({
      placeId: "",
      name: "",
      description: "",
      image: null,
      address: "",
      contact: "",
      priceRange: "",
      amenities: [""],
      roomFeatures: [""],
      lat: "",
      long: "",
    });
    setEditHotel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      if (!formData.placeId || !formData.name) {
        throw new Error("Place ID and hotel name are required");
      }

      const data = new FormData();
      const payload = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.long) || 0,
            parseFloat(formData.lat) || 0,
          ],
        },
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (["amenities", "roomFeatures", "location"].includes(key)) {
          data.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          data.append("image", value);
        } else {
          data.append(key, value);
        }
      });

      if (editHotel) {
        await axios.put(`${API_URL}/${editHotel._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Hotel updated successfully!");
      } else {
        await axios.post(API_URL, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Hotel added successfully!");
      }

      setModalOpen(false);
      resetForm();
      fetchHotels();
    } catch (err) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Hotel deleted successfully!");
      fetchHotels();
    } catch (err) {
      message.error("Failed to delete hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      placeId: hotel.placeId?._id || "",
      name: hotel.name || "",
      description: hotel.description || "",
      image: hotel.image,
      address: hotel.address || "",
      contact: hotel.contact || "",
      priceRange: hotel.priceRange || "",
      amenities: hotel.amenities.length ? hotel.amenities : [""],
      roomFeatures: hotel.roomFeatures.length ? hotel.roomFeatures : [""],
      lat: hotel.location?.coordinates?.[1] || "",
      long: hotel.location?.coordinates?.[0] || "",
    });
    setModalOpen(true);
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Place", dataIndex: ["placeId", "name"], key: "place" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Price", dataIndex: "priceRange", key: "priceRange" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Delete this hotel?",
                content: "This action cannot be undone.",
                okText: "Yes, Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk: () => handleDelete(record._id),
              });
            }}
            type="default"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Manage Hotels
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Hotel
        </Button>
      </div>

      <Space wrap className="mb-6">
        <Input.Search
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by place"
          value={filterPlace || undefined}
          onChange={setFilterPlace}
          allowClear
          style={{ width: 200 }}
        >
          {places.map((place) => (
            <Option key={place._id} value={place._id}>
              {place.name}
            </Option>
          ))}
        </Select>
      </Space>

      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredHotels}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}

      {/* Modal for Add/Edit */}
      <Modal
        open={modalOpen}
        title={editHotel ? "Edit Hotel" : "Add New Hotel"}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        footer={null}
        destroyOnHidden={true}
      >
        <HotelForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          places={places}
        />
      </Modal>
    </div>
  );
};

export default ManageHotels;
