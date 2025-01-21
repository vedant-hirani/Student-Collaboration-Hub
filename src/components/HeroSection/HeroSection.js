import React, { useState } from 'react';
import "./HeroSection.css";

const HeroSection = () => {
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  const eventTypes = [
    { id: 1, name: "Choose event type" },
    { id: 2, name: "Conferences" },
    { id: 3, name: "Workshops" },
    { id: 4, name: "Seminars" },
    { id: 5, name: "Networking" },
    { id: 6, name: "Tech Talks" },
    { id: 7, name: "Career Fairs" }
  ];

  const locations = [
    { id: 1, name: "Choose location" },
    { id: 2, name: "New York" },
    { id: 3, name: "San Francisco" },
    { id: 4, name: "Chicago" },
    { id: 5, name: "Los Angeles" },
    { id: 6, name: "Boston" },
    { id: 7, name: "Seattle" }
  ];

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search clicked:', { eventType, location, dateTime });
  };

  return (
    <div className="hero">
      <h1>Select Upcoming Events in Your Region</h1>
      <div className="hero-search">
        <select 
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="form-control"
        >
          {eventTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <select 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-control"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="form-control"
        />

        <button onClick={handleSearch} className="btn-search">
          Search
        </button>
      </div>
    </div>
  );
};

export default HeroSection;