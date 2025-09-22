import React, { useEffect, useState } from "react";
import CalendarCard from "./CalenderCard";

const CalendarCardContainer = () => {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    notesCount: 0,
    tripsCount: 0,
    savedCount: 0,
    completedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        
        const tripsRes = await fetch("/api/user/trips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tripsData = await tripsRes.json();

    
        const statsRes = await fetch("/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();

        setTrips(tripsData);
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <CalendarCard trips={trips} stats={stats} />;
};

export default CalendarCardContainer;
