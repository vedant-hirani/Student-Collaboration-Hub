import React, { useState } from 'react';
import './TrendingEvents.css';

// Correct way to import images
// import image2 from '../../../src/assets/image2.png';  // Using absolute path from src
// import image3 from '../../../src/assets/image3.png';
// import image4 from '../../../src/assets/image4.png';

// Alternatively, you can use this if your assets are in src folder
import image2 from '../../assests/image2.png';
import image3 from '../../assests/image2.png';
import image4 from '../../assests/image2.png';

const TrendingEvents = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // You can also use require if imports don't work
  const trendingEvents = [
    {
      title: "Tea Tasting Event",
      type: "Food & Drink",
      image: image2,  // or require('../../assets/image2.png')
      attendees: "2.5k interested"
    },
    {
      title: "Love Square Jazz Night",
      type: "Music & Arts",
      image: image3,  // or require('../../assets/image3.png')
      attendees: "1.8k interested"
    },
    {
      title: "Panorama at K5",
      type: "Culture",
      image: image4,  // or require('../../assets/image4.png')
      attendees: "3.2k interested"
    }
  ];

  // Rest of your component code remains the same...

  return (
    <div className="trending-section">
      <h2 className="trending-title animate-slide-in">
        Trending Events
        <span className="trending-badge">Hot 🔥</span>
      </h2>
      
      <div className="trending-grid">
        {trendingEvents.map((event, index) => (
          <div 
            key={index} 
            className={`event-card animate-fade-up`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="image-container">
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="image-overlay">
                <span className="attendees-count">{event.attendees}</span>
              </div>
              <button className="category-tag pulse">{event.type}</button>
            </div>
            
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <div className="card-footer">
                <a href="#" className="view-details">
                  View Details
                  <span className="arrow-indicator">→</span>
                </a>
                <button className={`like-button ${hoveredCard === index ? 'liked' : ''}`}>
                  <svg className="heart-icon" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-more-container">
        <button className="view-more-button shine-effect">
          View More Events
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TrendingEvents;
