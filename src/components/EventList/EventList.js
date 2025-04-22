// EventList.jsx
import React, { useEffect, useState } from 'react';
import './EventList.css'; // Make sure to create this CSS file

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events'); // your backend URL
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-list">
      <h2>All Events</h2>
      <div className="events">
        {events.map(event => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            {event.imageUrl && (
              <div className="image-container">
                <img
                  src={`http://localhost:5000${event.imageUrl}`}
                  alt={event.title}
                  className="event-image"
                />
              </div>
            )}
            <div className="event-details">
              <p className="event-description">{event.description}</p>
              <p className="event-date-time">{event.startDate} @ {event.startTime}</p>
              <p className="event-location">Location: {event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
