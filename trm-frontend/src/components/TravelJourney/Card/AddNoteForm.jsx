import React, { useState, useEffect } from 'react';
import Loader from "../../common/Loader";

const AddNote = ({ note, onClose }) => {
  const [content, setContent] = useState(note?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setContent(note?.content || "");
  }, [note]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Note cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const method = note ? "PUT" : "POST";
      const body = note
        ? { noteId: note._id, title: note.title, content }
        : { title: "Note", content };

      const res = await fetch("http://localhost:4000/api/journey/note", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

     
      const updatedNote = note ? data.notes.find(n => n._id === note._id) : data.notes[data.notes.length - 1];
      onClose(updatedNote || true); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md max-w-md">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your travel note here..."
        className="w-full border border-gray-300 p-3 rounded resize-none focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
        rows={6}
      />

      <div className="flex justify-end space-x-3 mt-3">
        <button
          onClick={() => onClose(null)} 
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center ${loading ? 'opacity-50  cursor-pointer' : ''}`}
        >
          {loading ? <Loader size={20} /> : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AddNote;



