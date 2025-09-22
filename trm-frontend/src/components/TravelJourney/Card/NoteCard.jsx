import React, { useState } from "react";
import { MapPinIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

const NoteCard = ({ note, userId, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/travel-journey/note/${userId}/${note._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete note");
      onUpdate();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg relative">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
      {note.location && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {note.location}
        </div>
      )}
      <p className="text-sm text-gray-700 mb-3">{note.content}</p>

      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => alert("Edit note")} className="p-1 rounded hover:bg-gray-100">
          <PencilIcon className="w-5 h-5 text-gray-500"/>
        </button>
        <button onClick={handleDelete} disabled={loading} className={`p-1 rounded hover:bg-gray-100 ${loading ? "opacity-50 cursor-not-allowed": ""}`}>
          <TrashIcon className="w-5 h-5 text-red-500"/>
        </button>
      </div>
    </div>
  );
};

export default NoteCard;


