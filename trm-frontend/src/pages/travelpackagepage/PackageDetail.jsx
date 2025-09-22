import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Users, Calendar, Shield, CheckCircle, XCircle 
} from 'lucide-react';
import BookingForm from './BookingForm'; // import your booking form

export default function PackageDetails({ pkg, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBooking, setShowBooking] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'policy', label: 'Policy', icon: Shield }
  ];

  const backendBaseUrl = 'http://localhost:4000'; // backend URL

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img
          src={pkg.image ? `${backendBaseUrl}${pkg.image}` : 'https://via.placeholder.com/1200x500'}
          alt={pkg.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white w-full">
            <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
            <div className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              {pkg.location}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Tabs */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Overview</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{pkg.overview}</p>
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <>
                        <h4 className="text-xl font-semibold mb-3">Highlights</h4>
                        <ul className="space-y-2">
                          {pkg.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'itinerary' && pkg.itinerary && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Day by Day Itinerary</h3>
                    <div className="space-y-6">
                      {pkg.itinerary.map((day) => (
                        <div key={day.day} className="border rounded-lg p-6 bg-gray-50">
                          <h4 className="text-lg font-semibold mb-3 text-blue-600">
                            Day {day.day}: {day.title}
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Activities</h5>
                              <ul className="space-y-1">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="text-gray-600 text-sm">
                                    • {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Meals & Accommodation</h5>
                              <div className="text-sm text-gray-600">
                                <p><strong>Meals:</strong> {day.meals.join(', ')}</p>
                                <p><strong>Stay:</strong> {day.accommodation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'policy' && pkg.policy && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">Terms & Policies</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3">Included</h4>
                        <ul className="space-y-1">
                          {pkg.policy.included.map((item, idx) => (
                            <li key={idx} className="text-green-700 text-sm flex items-start">
                              <CheckCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-3">Not Included</h4>
                        <ul className="space-y-1">
                          {pkg.policy.excluded.map((item, idx) => (
                            <li key={idx} className="text-red-700 text-sm flex items-start">
                              <XCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {pkg.policy.cancellation && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                        <p className="text-gray-700 text-sm">{pkg.policy.cancellation}</p>
                      </div>
                    )}
                    {pkg.policy.payment && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Payment Terms</h4>
                        <p className="text-blue-700 text-sm">{pkg.policy.payment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600">Rs {pkg.price}</div>
                <div className="text-gray-500">per person</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{pkg.duration} days</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <span>Min 2 travelers</span>
                </div>
                {pkg.bestSeason && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>Best Season: {pkg.bestSeason}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Shield className="h-5 w-5 mr-3" />
                  <span>
                    {pkg.transportAvailableOnArrival
                      ? "Transport available on arrival"
                      : "No transport provided"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingForm pkg={pkg} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
