import React from "react";
import { Calendar, MapPin, FileText, CheckCircle, Bookmark } from "lucide-react";

const CalendarCard = ({ trips = [], stats = {} }) => {
  const { notesCount = 0, tripsCount = 0, savedCount = 0, completedCount = 0 } = stats;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
     
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          Upcoming Trips
        </h2>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-6 text-gray-400">
            <MapPin className="w-10 h-10 mb-2" />
            <p className="text-sm">No upcoming trips yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {trips.map((trip) => (
              <li
                key={trip._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium">{trip.title}</p>
                  <p className="text-sm text-gray-500">{trip.date}</p>
                </div>
                <MapPin className="w-5 h-5 text-sky-500" />
              </li>
            ))}
          </ul>
        )}
      </div>

     
      <div>
        <h2 className="text-lg font-semibold mb-4">Travel Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center bg-sky-100 rounded-xl p-4">
            <FileText className="w-6 h-6 text-sky-600 mb-1" />
            <p className="text-lg font-bold">{notesCount}</p>
            <p className="text-sm text-gray-600">Notes</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-100 rounded-xl p-4">
            <MapPin className="w-6 h-6 text-green-600 mb-1" />
            <p className="text-lg font-bold">{tripsCount}</p>
            <p className="text-sm text-gray-600">Trips</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-purple-100 rounded-xl p-4">
            <Bookmark className="w-6 h-6 text-purple-600 mb-1" />
            <p className="text-lg font-bold">{savedCount}</p>
            <p className="text-sm text-gray-600">Saved</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-orange-100 rounded-xl p-4">
            <CheckCircle className="w-6 h-6 text-orange-600 mb-1" />
            <p className="text-lg font-bold">{completedCount}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
