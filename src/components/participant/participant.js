// src/components/participant/Participant.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Participant = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        console.log('Fetching participants for eventId:', eventId); // Debugging
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        console.log('Participants response:', response.data); // Debugging
        setParticipants(response.data.participants); // Assuming participants are in response.data.participants
        setLoading(false);
      } catch (err) {
        console.error('Error fetching participants:', err.response || err.message); // Debugging
        setError('Failed to fetch participants');
        setLoading(false);
      }
    };

    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  if (loading) {
    return <p>Loading participants...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Participants List</h2>
      {participants.length === 0 ? (
        <p>No participants found for this event.</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant._id}>{participant.name}</li> // Assuming participant has a 'name' field
          ))}
        </ul>
      )}
    </div>
  );
};

export default Participant;

