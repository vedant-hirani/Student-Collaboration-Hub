import React from 'react';  
import './eventSection.css';
import eventImage from '../../assests/image4.png';  

const EventSection = () => {  
    return (  
        <div className="event-section">  
            {/* Left Side - Illustration */}  
            <div className="event-illustration">  
                <img src={eventImage} alt="Event Illustration" />  
            </div>  

            {/* Right Side - Event Cards */}  
            <div className="event-cards">  
                <div className="event-card-s">  
                    <h2>Make Your Own Event</h2>  
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>  
                    <button className="cta-button">Create Events</button>  
                </div>  

                <div className="event-card-s">  
                    <h2>Notify Us of Upcoming Events</h2>  
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>  
                    <button className="cta-button">Notify Events</button>  
                </div>  
            </div>  
        </div>  
    );  
};  

export default EventSection;