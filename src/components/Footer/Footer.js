import React from "react";
import "./Footer.css"; // CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <h1 className="footer-title">Event Hive</h1>
        </div>

        <div className="footer-middle">
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Home</a></li>
              <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Events</a></li>
              <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">About Us</a></li>
              <li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Contact</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: support@eventhive.com</p>
            <p>Phone: +91-1234567890</p>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Event Hive. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
