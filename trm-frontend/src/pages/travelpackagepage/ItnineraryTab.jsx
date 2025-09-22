import React from "react";

export default function ItineraryTab({ pkg }) {
  return (
    <div className="space-y-6">
      {pkg.itinerary && pkg.itinerary.length > 0 ? (
        pkg.itinerary.map((day) => (
          <div
            key={day.day}
            className="border rounded-xl p-4 bg-gray-50 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">
              Day {day.day}: {day.title}
            </h3>

            {day.activities && day.activities.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">Activities:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                  {day.activities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            )}

            {day.meals && day.meals.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">Meals:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                  {day.meals.map((meal, idx) => (
                    <li key={idx}>{meal}</li>
                  ))}
                </ul>
              </div>
            )}

            {day.accommodation && (
              <div>
                <h4 className="font-medium text-gray-800">Accommodation:</h4>
                <p className="text-gray-600">{day.accommodation}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No itinerary available.</p>
      )}
    </div>
  );
}


