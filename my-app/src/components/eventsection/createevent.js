import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    category: '',
    eventType: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login', { state: { from: '/create-event' } });
      return;
    }
    
    // Optional: Verify token is valid
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login', { state: { from: '/create-event' } });
    }
  }, [navigate]);

  const getApi = () => {
    const token = localStorage.getItem('userToken');
    console.log('Current userToken:', token);
    
    return axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Authorization': `Bearer ${token || ''}`  // Add fallback to empty string
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Get the token using the correct key
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('No authentication token found');
      navigate('/login');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      setIsLoading(true);
      setError(null);
  
      const api = getApi();
      const response = await api.post('/events/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
  
      setEventData(prev => ({
        ...prev,
        imageUrl: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        setError('Please login again');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error uploading image');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!eventData.title || !eventData.description || !eventData.location) {
      setError('Please fill in all required fields');
      return;
    }
  
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.id) {
      setError('User not authenticated');
      navigate('/login');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const api = getApi();
      const response = await api.post('/events', {
        ...eventData,
        date: `${eventData.startDate}T${eventData.startTime}`,
        creatorId: userData.id  // Make sure we're passing the ID
      });
  
      if (response.status === 201) {
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.response?.status === 403) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error creating event');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <button className="btn btn-link" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <h2 className="text-center">Create New Event</h2>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center 
                  ${activeStep >= step ? 'bg-primary' : 'bg-secondary'} text-white`} 
                  style={{width: '40px', height: '40px'}}>
                  {step}
                </div>
                <p className="mt-2">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Preview'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {activeStep === 1 && (
            <>
              <div className="mb-4 text-center">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  id="imageUpload"
                  className="d-none"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="img-fluid mb-2" 
                      style={{maxHeight: '200px'}}
                    />
                  ) : (
                    <div className="border rounded p-4">
                      <i className="bi bi-camera fs-2"></i>
                      <p>Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={eventData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select 
                    name="category"
                    className="form-select"
                    value={eventData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Event Type</label>
                  <select 
                    name="eventType"
                    className="form-select"
                    value={eventData.eventType}
                    onChange={handleInputChange}
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeStep === 2 && (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={eventData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    className="form-control"
                    value={eventData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={eventData.location}
                  onChange={handleInputChange}
                  placeholder="Enter venue or virtual meeting link"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={eventData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                ></textarea>
              </div>
            </>
          )}

          {activeStep === 3 && (
            <div className="preview-container">
              {previewImage && (
                <img src={previewImage} alt="Event" className="img-fluid mb-4" />
              )}
              <h4>{eventData.title}</h4>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Category:</strong> {eventData.category}</p>
                  <p><strong>Event Type:</strong> {eventData.eventType}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Date:</strong> {eventData.startDate}</p>
                  <p><strong>Time:</strong> {eventData.startTime}</p>
                </div>
              </div>
              <p><strong>Location:</strong> {eventData.location}</p>
              <p><strong>Description:</strong></p>
              <p>{eventData.description}</p>
            </div>
          )}

<div className="d-flex justify-content-between mt-4">
      {activeStep > 1 && (
        <button 
          className="btn btn-outline-primary"
          onClick={() => setActiveStep(activeStep - 1)}
          disabled={isLoading}
        >
          Previous
        </button>
      )}
      <button 
        className="btn btn-primary ms-auto"
        onClick={activeStep === 3 ? handleSubmit : handleNext}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : activeStep === 3 ? 'Create Event' : 'Next'}
      </button>
    </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;