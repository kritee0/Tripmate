import React from "react";

export default function PolicyTab({ pkg }) {
  const policy = pkg.policy || {};
  return (
    <div className="space-y-4">
      {policy.included && policy.included.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Included</h3>
          <ul className="list-disc ml-5 text-gray-600">
            {policy.included.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {policy.excluded && policy.excluded.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Excluded</h3>
          <ul className="list-disc ml-5 text-gray-600">
            {policy.excluded.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {policy.cancellation && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
          <p className="text-gray-600">{policy.cancellation}</p>
        </div>
      )}

      {policy.payment && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Policy</h3>
          <p className="text-gray-600">{policy.payment}</p>
        </div>
      )}
    </div>
  );
}

