import React, { useEffect, useState } from 'react';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenModal = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      additionalInfo: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get token from localStorage (assuming you store it there after login)
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'You must be logged in to register for events.' });
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${currentEvent._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful!' });
        // Update the events list to reflect the registration
        const updatedEvents = events.map(event => 
          event._id === currentEvent._id 
            ? { ...event, registrations: [...(event.registrations || []), { userData: formData }] } 
            : event
        );
        setEvents(updatedEvents);
        
        // Close modal after a delay to show success message
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      setMessage({ type: 'error', text: 'An error occurred during registration.' });
    }
    
    setLoading(false);
  };

  // Create a custom modal
  const CustomModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3 className="fw-bold">Register for {currentEvent?.title}</h3>
            <button className="close-button" onClick={handleCloseModal}>×</button>
          </div>
          <div className="modal-body">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="name" className="fw-semibold">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="fw-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalInfo" className="fw-semibold">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any dietary restrictions, special needs, etc."
                  rows={3}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="event-list container-fluid py-4">
      <h2 className="section-title fw-bold mb-4">All Events</h2>
      <div className="events-grid">
        {events.map(event => (
          <div key={event._id} className="event-card shadow-sm">
            <h3 className="fw-semibold text-dark">{event.title}</h3>
            {event.imageUrl && (
              <div className="image-container">
                <img
                  src={`http://localhost:5000${event.imageUrl}`}
                  alt={event.title}
                  className="event-image"
                />
              </div>
            )}
            <div className="event-details d-flex flex-column">
              <p className="event-description mb-3">{event.description}</p>
              <div className="mt-auto">
                <p className="event-date-time mb-2">
                  <i className="bi bi-calendar me-2"></i>
                  {event.startDate} @ {event.startTime}
                </p>
                <p className="event-location mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  Location: {event.location}
                </p>
                <button 
                  className="register-button fw-semibold text-white"
                  onClick={() => handleOpenModal(event)}
                >
                  Register for Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CustomModal />
    </div>
  );
};

export default EventList;