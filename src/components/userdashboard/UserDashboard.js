import React, { useEffect, useState } from 'react';
import './userdashboard.css';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Your Events</h2>
      {events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <img src={event.imageUrl} alt={event.title} className="event-image" />
              <h3>{event.title}</h3>
              <p>{event.category}</p>
              <p>{new Date(event.startDate).toLocaleDateString()}</p>
              <p>{event.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Sorry, no events created.</p>
      )}
    </div>
  );
};

export default UserDashboard;
