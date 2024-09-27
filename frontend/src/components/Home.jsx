import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Для поиска мероприятий
  const [sortOrder, setSortOrder] = useState('dateAsc'); // Для сортировки мероприятий
  const user = useSelector((state) => state.user.user); // Получаем текущего пользователя

  useEffect(() => {
    // Загружаем мероприятия с сервера
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
        body: JSON.stringify({ userName: user.name }) // Передаем имя текущего пользователя
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

  // Функция для фильтрации мероприятий
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция для сортировки мероприятий
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

  return (
    <div className="home">
      <h1>Все мероприятия</h1>
      <input
        type="text"
        placeholder="Поиск мероприятий..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="dateAsc">По дате (возрастание)</option>
        <option value="dateDesc">По дате (убывание)</option>
        <option value="titleAsc">По названию (A-Z)</option>
        <option value="titleDesc">По названию (Z-A)</option>
      </select>
      {sortedEvents.length > 0 ? (
        <ul>
          {sortedEvents.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
              <p>Место проведения: {event.location || 'Не указано'}</p>
              <h4>Задачи:</h4>
              {event.tasks.length > 0 ? (
                <ul>
                  {event.tasks.map((task, index) => (
                    <li key={index}>
                      <p>Описание: {task.description}</p>
                      <p>Ответственный: {task.assignedTo || 'Не указано'}</p>
                      <p>Срок выполнения: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Не указано'}</p>
                      <p>Статус: {task.completed ? 'Выполнено' : 'Не выполнено'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Задач нет</p>
              )}
              <p>Бюджет:</p>
              <p>Доходы: {event.budget.income}</p>
              <p>Расходы: {event.budget.expenses}</p>

              {/* Добавляем кнопку удаления, доступную только для создателя мероприятия или администратора */}
              {user && (event.createdBy === user.name || user.name === 'admin') && (
                <button onClick={() => deleteEvent(event._id)}>Удалить мероприятие</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Мероприятий нет</p>
      )}
    </div>
  );
}
