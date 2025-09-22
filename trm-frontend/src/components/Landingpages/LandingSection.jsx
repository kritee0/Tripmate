import React from "react";
import swayambu from "../../assets/herosection/swayambu.jpg";
import Light from "../../assets/herosection/light.jpg";

const features = [
  {
    title: "Explore Temples",
    desc: "Visit historic temples and spiritual sites across Nepal.",
  },
  {
    title: "Adventure Sports",
    desc: "Trekking, paragliding, and boating in breathtaking landscapes.",
  },
  {
    title: "Cultural Tours",
    desc: "Discover local traditions, festivals, and culinary delights.",
  },
];

const LandingContent = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-16 space-y-16">
      
      {/* Intro Paragraph */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Discover Nepal Like Never Before
        </h2>
        <p className="text-green-700 text-lg leading-relaxed">
          From majestic temples and serene lakes to thrilling adventures, Nepal
          has something for every traveler. Experience breathtaking views,
          rich culture, and unforgettable moments.
        </p>
      </section>

      {/* Feature Highlights FIRST */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {features.map((feat, i) => (
          <div
            key={i}
            className="p-6 bg-green-50 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              {feat.title}
            </h3>
            <p className="text-green-700 text-sm">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Two Images Side by Side */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={swayambu}
          alt="Swayambhunath"
          className="w-full h-64 object-cover rounded-xl shadow-md"
        />
        <img
          src={Light}
          alt="Pokhara Lake"
          className="w-full h-64 object-cover rounded-xl shadow-md"
        />
      </section>
    </div>
  );
};

export default LandingContent;
