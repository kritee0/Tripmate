import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";


const TravelNotes = ({ triggerEdit, refreshTrigger }) => {
  const [notes, setNotes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/journey/note", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchNotes();
  }, [refreshTrigger]);

  const handleDelete = async (noteId) => {
    try {
      const res = await fetch("http://localhost:4000/api/journey/note", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ noteId }),
      });
      const data = await res.json();
      if (data.success) fetchNotes();
      else setErrorMsg(data.message || "Failed to delete note");
    } catch {
      setErrorMsg("Failed to delete note");
    }
  };

  return (
    <div>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note._id} className="border p-3 rounded flex justify-between items-start">
              <div>
                <h3 className="font-bold">{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600" onClick={() => triggerEdit(note)}>
                <PencilIcon className="w-5 h-5" />
                </button>
                <button className="text-red-600" onClick={() => handleDelete(note._id)}>
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelNotes;









