import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import EventList from './EventList';

const Dashboard = ({ token }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('http://localhost:5000/events', { headers: { Authorization: token } });
      setEvents(response.data);
    };
    fetchEvents();
  }, [token]);

  const handleEventCreated = async () => {
    const response = await axios.get('http://localhost:5000/events', { headers: { Authorization: token } });
    setEvents(response.data);
  };

  return (
    <div>
      <h1>Личный кабинет</h1>
      <EventForm token={token} onEventCreated={handleEventCreated} />
      <EventList events={events} />
    </div>
  );
};

export default Dashboard;
