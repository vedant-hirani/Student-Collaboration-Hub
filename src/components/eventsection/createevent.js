import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateEventPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  // Preview image
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      // Handle file upload and preview
      if (files && files[0]) {
        setFormData({ ...formData, image: files[0] });
        
        // Create preview URL for the image
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Create FormData object for multipart/form-data submission
    const data = new FormData();
    
    // Append text fields
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('eventType', formData.eventType);
    data.append('startDate', formData.startDate);
    data.append('startTime', formData.startTime);
    data.append('location', formData.location);
    data.append('description', formData.description);
    
    // Append file with correct field name (should match backend)
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result.event);
        navigate('/events'); // Navigate to events page or wherever appropriate
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('An error occurred while creating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create New Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input 
            type="text" 
            id="title"
            name="title" 
            placeholder="Enter event title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input 
              type="text" 
              id="category"
              name="category" 
              placeholder="e.g., Music, Sports, Workshop" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <input 
              type="text" 
              id="eventType"
              name="eventType" 
              placeholder="e.g., Conference, Concert, Meetup" 
              value={formData.eventType} 
              onChange={handleChange} 
              required 
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input 
              type="date" 
              id="startDate"
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              required 
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input 
              type="time" 
              id="startTime"
              name="startTime" 
              value={formData.startTime} 
              onChange={handleChange} 
              required 
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input 
            type="text" 
            id="location"
            name="location" 
            placeholder="Event venue or address" 
            value={formData.location} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            id="description"
            name="description" 
            placeholder="Describe your event" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            rows="4"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Event Image
          </label>
          <input 
            type="file" 
            id="image"
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
          />
          
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="h-40 object-contain border rounded"
              />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded transition-colors mt-4`}
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;