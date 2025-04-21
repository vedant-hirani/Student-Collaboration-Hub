import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './eventdetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would typically come from an API or props
  const eventDetails = {
    id: 1,
    title: 'Coding Bootcamp',
    type: 'Education',
    image: '../../assests/image2.png',
    attendees: '5.0k interested',
    date: '2025-03-15',
    time: '09:00 AM',
    location: 'Tech Hub, San Francisco',
    price: '$299',
    description: 'Join our intensive coding bootcamp and learn modern web development.',
    organizer: 'Tech Education Inc.',
    duration: '3 hours',
    requirements: 'Laptop, Basic programming knowledge',
    additionalInfo: 'Refreshments will be provided'
  };

  const handleRegister = () => {
    // Add registration logic here
    console.log('Registering for event:', id);
  };

  return (
    <div className="event-details-container">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Events
      </button>

      <div className="event-header">
        <img 
          src={eventDetails.image} 
          alt={eventDetails.title} 
          className="event-banner"
        />
        <div className="event-header-content">
          <span className="event-type">{eventDetails.type}</span>
          <h1>{eventDetails.title}</h1>
          <p className="event-organizer">by {eventDetails.organizer}</p>
        </div>
      </div>

      <div className="event-content">
        <div className="event-main">
          <section className="event-description">
            <h2>About this Event</h2>
            <p>{eventDetails.description}</p>
          </section>

          <section className="event-requirements">
            <h2>Requirements</h2>
            <p>{eventDetails.requirements}</p>
          </section>

          <section className="additional-info">
            <h2>Additional Information</h2>
            <p>{eventDetails.additionalInfo}</p>
          </section>
        </div>

        <div className="event-sidebar">
          <div className="event-info-card">
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{eventDetails.date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time</span>
              <span className="info-value">{eventDetails.time}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Duration</span>
              <span className="info-value">{eventDetails.duration}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{eventDetails.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price</span>
              <span className="info-value">{eventDetails.price}</span>
            </div>
            <button 
              className="register-button"
              onClick={handleRegister}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;