import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux';
import './home.css'
export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('dateAsc');
  const [expandedTasks, setExpandedTasks] = useState({});
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error);
      }
    };

    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    if (!user || !user.name) {
      alert('Вы должны быть авторизованы для удаления мероприятия');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user.name })
      });

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== id));
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Ошибка удаления мероприятия:', error);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortOrder === 'dateAsc') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === 'dateDesc') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === 'titleAsc') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'titleDesc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const toggleTasks = (eventId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className="home">
      <h1 className="home__title">Все мероприятия</h1>
      <div className="home__controls">
        <input
          type="text"
          className="home__search-input"
          placeholder="Поиск мероприятий..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="home__sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="dateAsc">По дате (возрастание)</option>
          <option value="dateDesc">По дате (убывание)</option>
          <option value="titleAsc">По названию (A-Z)</option>
          <option value="titleDesc">По названию (Z-A)</option>
        </select>
      </div>
      {sortedEvents.length > 0 ? (
        <div className="event-grid">
          {sortedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <h3 className="event-card__title">{event.title}</h3>
              <p className="event-card__date">Дата: {new Date(event.date).toLocaleDateString()}</p>
              <p className="event-card__location">Место проведения: {event.location || 'Не указано'}</p>
              <img src={event.img} alt="event" className="event-card__image" />
              
              <button
                className="event-card__toggle-tasks-button"
                onClick={() => toggleTasks(event._id)}
              >
                {expandedTasks[event._id] ? 'Скрыть задачи' : 'Показать задачи'}
              </button>
              
              {expandedTasks[event._id] && (
                <div className="event-card__tasks">
                  <h4 className="event-card__tasks-title">Задачи:</h4>
                  {event.tasks.length > 0 ? (
                    <ul className="event-card__tasks-list">
                      {event.tasks.map((task, index) => (
                        <li key={index} className="event-card__task">
                          <p className="task__description">Описание: {task.description}</p>
                          <p className="task__assigned-to">Ответственный: {task.assignedTo || 'Не указано'}</p>
                          <p className="task__due-date">Срок выполнения: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Не указано'}</p>
                          <p className="task__status">Статус: {task.completed ? 'Выполнено' : 'Не выполнено'}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="event-card__no-tasks">Задач нет</p>
                  )}
                </div>
              )}
              <p className="event-card__budget">Бюджет:</p>
              <p className="event-card__income">Доходы: {event.budget.income}</p>
              <p className="event-card__expenses">Расходы: {event.budget.expenses}</p>

              {user && (event.createdBy === user.name || user.name === 'admin') && (
                <button
                  className="event-card__delete-button"
                  onClick={() => deleteEvent(event._id)}
                >
                  Удалить мероприятие
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="home__no-events">Мероприятий нет</p>
      )}
    </div>
  );
}
