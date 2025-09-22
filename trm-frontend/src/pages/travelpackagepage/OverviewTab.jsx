import React from "react";

export default function OverviewTab({ pkg }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">{pkg.overview}</p>

      {pkg.highlights && pkg.highlights.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Highlights</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-600">
            {pkg.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
