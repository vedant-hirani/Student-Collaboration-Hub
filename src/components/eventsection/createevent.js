import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './eventpage.css';

const CreateEventPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    eventType: '',
    startDate: '',
    startTime: '',
    location: '',
    description: '',
    image: null
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        console.log('Event created:', formData);
        navigate('/'); // Redirect to home screen
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="top-nav">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <button className="back-button" onClick={() => window.history.back()}>
              <i className="bi bi-arrow-left"></i>
              Back
            </button>
            <h2 className="mb-0">Create New Event</h2>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className="progress-step">
              <div className={`step-number ${activeStep >= step ? 'active' : ''}`}>
                {step}
              </div>
              <div className={`step-label ${activeStep >= step ? 'active' : ''}`}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Preview'}
              </div>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="form-container">
          {activeStep === 1 && (
            <form>
              <div className="upload-area mb-4">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Give your event a catchy title"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>Conference</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Networking</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Event Type</label>
                  <select 
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>In-Person</option>
                    <option>Virtual</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {activeStep === 2 && (
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar form-icon"></i>
                    Start Date
                  </label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-control" 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-clock form-icon"></i>
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="form-control" 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-geo-alt form-icon"></i>
                  Location
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Enter venue or virtual meeting link"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control" 
                  rows="4"
                  placeholder="Describe your event..."
                ></textarea>
              </div>
            </form>
          )}

          {activeStep === 3 && (
            <div className="preview-container bg-light p-4 rounded">
              <h4 className="mb-4">Event Preview</h4>
              <div className="event-preview">
                {formData.image && (
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="Event" 
                    className="event-image-preview" 
                    style={{ width: '100%', height: 'auto', maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                  />
                )}
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Event Type:</strong> {formData.eventType}</p>
                <p><strong>Date:</strong> {new Date(formData.startDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.startTime}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Description:</strong> {formData.description}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            {activeStep > 1 && (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous
              </button>
            )}
            {activeStep < 3 ? (
              <button 
                className="btn btn-primary ms-auto"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Next
              </button>
            ) : (
              <button 
                className="btn btn-primary ms-auto"
                onClick={handleSubmit}
              >
                Create Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};
export default CreateEventPage;
