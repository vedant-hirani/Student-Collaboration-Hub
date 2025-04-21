// src/pages/EventsPage.js
import React from 'react';

const EventsPage = ({ events }) => {
  return (
    <div className="container py-5">
      <div className="row">
        {events.map((event) => (
          <div key={event.id} className="col-md-4 mb-4">
            <div className="card h-100">
              {event.image && (
                <img 
                  src={event.image} 
                  className="card-img-top" 
                  alt={event.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary">{event.category}</span>
                  <small className="text-muted">{event.location}</small>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary w-100">Register Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;