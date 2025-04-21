import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventList.css';

const EventList = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const eventList = [
    {
      id: 1,
      title: 'Coding Bootcamp',
      type: 'Education',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
      attendees: '5.0k interested',
      date: '2025-03-15',
      time: '09:00 AM',
      location: 'Tech Hub, San Francisco'
    },
    {
      id: 2,
      title: 'Startup Pitch Night',
      type: 'Business',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800',
      attendees: '3.1k interested',
      date: '2025-03-20',
      time: '06:00 PM',
      location: 'Innovation Center, New York'
    },
    {
      id: 3,
      title: 'Art Expo',
      type: 'Art',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800',
      attendees: '2.7k interested',
      date: '2025-03-25',
      time: '10:00 AM',
      location: 'City Gallery, Chicago'
    }
  ];

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleLike = (e, eventId) => {
    e.stopPropagation();
    // Add like functionality here
    console.log('Liked event:', eventId);
  };

  return (
    <div className="trending-section">
      <h2 className="trending-title animate-slide-in">
        Upcoming Events
        <span className="trending-badge">Don't Miss 🚀</span>
      </h2>

      <div className="trending-grid">
        {eventList.map((event, index) => (
          <div
            key={event.id}
            className={`event-card ${hoveredCard === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleEventClick(event.id)}
          >
            <div className="image-container">
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="image-overlay">
                <span className="attendees-count">{event.attendees}</span>
              </div>
              <button className="category-tag pulse">{event.type}</button>
            </div>
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-info">
                {event.date} • {event.time}
              </p>
              <p className="event-location">{event.location}</p>
              <div className="card-footer">
                <button className="view-details">
                  View Details
                  <svg
                    className="arrow-indicator"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button 
                  className="like-button"
                  onClick={(e) => handleLike(e, event.id)}
                >
                  <svg
                    className="heart-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;