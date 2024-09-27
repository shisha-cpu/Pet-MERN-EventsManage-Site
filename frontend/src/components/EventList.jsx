import React from 'react';

const EventList = ({ events }) => {
  return (
    <div>
      <h2>Список мероприятий</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
            <p>Место: {event.location}</p>
            <p>Бюджет: Доход: {event.budget.income} руб., Расход: {event.budget.expenses} руб.</p>
            <ul>
              {event.tasks.map((task, index) => (
                <li key={index}>{task.description} - {task.completed ? 'Выполнено' : 'Не выполнено'}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
