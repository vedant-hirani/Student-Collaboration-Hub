import React, { useState } from 'react';
import { opportunities } from '../../data/dummy_data';
import "./HeroSection.css";

const HeroSection = ({ onSearch }) => {
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  // Convert Sets to Arrays properly
  const uniqueCategories = Array.from(new Set(opportunities.map(opp => opp.category)));
  const uniqueLocations = Array.from(new Set(opportunities.map(opp => opp.location)));

  // Create event types array with default option
  const eventTypes = [
    { id: 1, name: "Choose event type" },
    ...uniqueCategories.map((category, index) => ({
      id: index + 2,
      name: category
    }))
  ];

  // Create locations array with default option
  const locations = [
    { id: 1, name: "Choose location" },
    ...uniqueLocations.map((location, index) => ({
      id: index + 2,
      name: location
    }))
  ];

  const handleSearch = () => {
    // Filter opportunities based on selected criteria
    const filteredEvents = opportunities.filter(event => {
      const matchesType = !eventType || eventType === "1" || 
                         event.category === eventTypes.find(t => t.id === Number(eventType))?.name;
      
      const matchesLocation = !location || location === "1" || 
                            event.location === locations.find(l => l.id === Number(location))?.name;
      
      const matchesDate = !dateTime || 
                         new Date(event.postedDate).toLocaleDateString() === 
                         new Date(dateTime).toLocaleDateString();

      return matchesType && matchesLocation && matchesDate;
    });

    // Pass filtered results to parent component
    if (onSearch) {
      onSearch(filteredEvents);
    }

    console.log('Filtered Events:', filteredEvents);
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Discover Campus Events</h1>
        <p>Find and join exciting events happening around you</p>
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
            Search Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;