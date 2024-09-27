import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ token, onEventCreated }) => {
  const [event, setEvent] = useState({ title: '', date: '', location: '', tasks: [], budget: { income: 0, expenses: 0 } });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/events', event, { headers: { Authorization: token } });
    onEventCreated();
    setEvent({ title: '', date: '', location: '', tasks: [], budget: { income: 0, expenses: 0 } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Создание мероприятия</h2>
      <input type="text" name="title" placeholder="Название" value={event.title} onChange={handleChange} required />
      <input type="date" name="date" value={event.date} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Место" value={event.location} onChange={handleChange} />
      <input type="number" name="budget.income" placeholder="Доход" value={event.budget.income} onChange={handleChange} />
      <input type="number" name="budget.expenses" placeholder="Расход" value={event.budget.expenses} onChange={handleChange} />
      <button type="submit">Создать мероприятие</button>
    </form>
  );
};

export default EventForm;
