import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TravelNotes from "./TravelNotes";
import AddNote from "./AddNoteForm";
import AddTripForm from "./AddTripForm";
import { BookOpenIcon, MapPinIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import SavePlaceButton from "./Saveplace";
import Loader from "../../common/Loader";

const TravelJourney = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("notes");
  const [showAddNote, setShowAddNote] = useState(false);
  const [editNoteData, setEditNoteData] = useState(null);
  const [refreshNotesTrigger, setRefreshNotesTrigger] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [message, setMessage] = useState("");
  const [showTripForm, setShowTripForm] = useState(false); 
  const [nextTrip, setNextTrip] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); 

  const tabs = [
    { key: "notes", label: "Notes", icon: BookOpenIcon },
    { key: "places", label: "Saved Places", icon: MapPinIcon },
    { key: "plan", label: "Plan Trip", icon: ClipboardDocumentListIcon },
  ];

  const refreshNotes = () => setRefreshNotesTrigger(prev => !prev);

  const fetchSavedPlaces = async () => {
    setLoadingPlaces(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/journey/saved-places", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSavedPlaces(data.savedPlaces || []);
    } catch (err) {
      console.error("Failed to fetch saved places:", err);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const fetchJourney = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/journey", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNextTrip(data.journey.nextTrip || null);
    } catch (err) {
      console.error("Failed to fetch journey:", err);
    }
  };

  useEffect(() => {
    fetchSavedPlaces();
    fetchJourney();

   
    if (location.state?.scrollToNextTrip) {
      setActiveTab("plan"); 
      setShowTripForm(true); 
      if (location.state.selectedPlace) setSelectedPlace(location.state.selectedPlace);
    }
  }, [location]);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-6 border-b pb-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-2 ${
              activeTab === tab.key
                ? "border-b-2 border-green-700 text-green-700 font-semibold"
                : "text-gray-600 hover:text-green-700"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      
      {message && (
        <p className="text-center mb-4 text-green-700 font-medium">{message}</p>
      )}

    
      {activeTab === "notes" && (
        <div className="flex gap-6">
          <div className="flex-1 max-h-[500px] overflow-y-auto">
            <TravelNotes triggerEdit={setEditNoteData} refreshTrigger={refreshNotesTrigger} />
          </div>
          <div className="flex flex-col items-start mt-0">
            <button
              onClick={() => setShowAddNote(true)}
              className="px-4 py-2 bg-green-700 text-white rounded"
            >
              Add Note
            </button>
          </div>
        </div>
      )}

     
      {activeTab === "places" && (
        <div>
          {loadingPlaces ? (
            <Loader />
          ) : savedPlaces.length === 0 ? (
            <p className="text-gray-500">You haven’t saved any places yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.map(place => (
                <div key={place._id} className="relative border rounded-lg p-3 shadow-sm">
                  <img
                    src={place.image || "https://via.placeholder.com/150"}
                    alt={place.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="mt-2 font-bold">{place.name}</h3>
                  <p className="text-sm text-gray-600">{place.location}</p>
                  <SavePlaceButton place={place} onChange={fetchSavedPlaces} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    
      {activeTab === "plan" && (
        <div className="max-w-lg mx-auto">
          {showTripForm ? (
            <AddTripForm
              placeId={selectedPlace?._id || null} 
              initialSuggestions={nextTrip?.packingSuggestions || []}
              onClose={async (msg) => {
                if (msg) setMessage(msg);
                setShowTripForm(false);
                await fetchJourney(); 
              }}
            />
          ) : nextTrip ? (
            <div className="border rounded-lg p-4 shadow-md bg-green-50">
              <h3 className="font-semibold mb-2">Your Next Trip</h3>
              <p>
                <strong>Start:</strong> {new Date(nextTrip.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(nextTrip.endDate).toLocaleDateString()}
              </p>
              {nextTrip.packingSuggestions?.length > 0 && (
                <div>
                  <strong>Packing:</strong>
                  <ul className="list-disc ml-5">
                    {nextTrip.packingSuggestions.map((item, idx) => (
                      <li key={idx}>{item.item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => setShowTripForm(true)}
                className="mt-3 px-4 py-2 bg-green-700 text-white rounded"
              >
                Edit / Add Trip
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No next trip planned yet.</p>
          )}
        </div>
      )}

   
      {showAddNote && (
        <AddNote
          onClose={saved => {
            setShowAddNote(false);
            if (saved) refreshNotes();
          }}
        />
      )}

    
      {editNoteData && (
        <AddNote
          note={editNoteData}
          onClose={updated => {
            setEditNoteData(null);
            if (updated) refreshNotes();
          }}
        />
      )}
    </div>
  );
};

export default TravelJourney;










