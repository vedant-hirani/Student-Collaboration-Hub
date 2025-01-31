import React from 'react';
import './eventSection.css';
import { useNavigate } from 'react-router-dom';

const EventSection = () => {

    const navigate = useNavigate(); // Initialize navigate

  // Navigation handler functions
  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleNotifyEvent = () => {
    navigate('/notify-event');
  };


  return (
    <div className="event-section">
      {/* Left Side - Illustration */}
      <div className="event-illustration">
        <div className="event-illustration-wrapper">
          {/* Replace this URL with your actual image URL */}
          <img 
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3"
            alt="Event Illustration" 
          />
          <div className="event-illustration-overlay"></div>
        </div>
      </div>

      {/* Right Side - Event Cards */}
      <div className="event-cards">
        <div className="event-card">
          <div className="card-content">
            <h2>Make Your Own Event</h2>
            <p>Create and customize your own events with our intuitive event builder. 
               Set dates, add details, and manage registrations all in one place.</p>
            <button className="cta-button" onClick={handleCreateEvent} >Create Events</button>
          </div>
        </div>

        <div className="event-card">
          <div className="card-content">
            <h2>Notify Us of Upcoming Events</h2>
            <p>Let us know about your upcoming events and we'll help you promote them
               to the right audience. Reach more people with our platform.</p>
            <button className="cta-button" onClick={handleNotifyEvent} >Notify Events</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSection;