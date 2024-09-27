import { useSelector } from "react-redux";
import { useState } from "react";
import './dashboard.css';

export default function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tasks, setTasks] = useState([{ description: '', assignedTo: '', dueDate: '' }]);
  const [img, setImg] = useState('');
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      date,
      location,
      tasks,
      img,
      budget: { income, expenses },
      createdBy: user.name,
    };

    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (response.ok) {
        alert('Мероприятие успешно добавлено');
        setTitle('');
        setDate('');
        setImg('');
        setLocation('');
        setTasks([{ description: '', assignedTo: '', dueDate: '' }]);
        setIncome(0);
        setExpenses(0);
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.message}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при добавлении мероприятия');
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Личный кабинет пользователя: {user.name}</h1>
      <form onSubmit={handleSubmit} className="dashboard__form">
        <div className="dashboard__form-group">
          <label className="dashboard__label">Название мероприятия:</label>
          <input
            type="text"
            className="dashboard__input-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Фото:</label>
          <input
            type="text"
            className="dashboard__input-text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            required
          />
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Дата мероприятия:</label>
          <input
            type="date"
            className="dashboard__input-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Место проведения:</label>
          <input
            type="text"
            className="dashboard__input-text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Задачи:</label>
          {tasks.map((task, index) => (
            <div key={index} className="dashboard__tasks">
              <input
                type="text"
                className="dashboard__input-text"
                placeholder="Описание задачи"
                value={task.description}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].description = e.target.value;
                  setTasks(updatedTasks);
                }}
              />
              <input
                type="text"
                className="dashboard__input-text"
                placeholder="Ответственный"
                value={task.assignedTo}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].assignedTo = e.target.value;
                  setTasks(updatedTasks);
                }}
              />
              <input
                type="date"
                className="dashboard__input-date"
                value={task.dueDate}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].dueDate = e.target.value;
                  setTasks(updatedTasks);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="dashboard__button dashboard__button--add"
            onClick={() => setTasks([...tasks, { description: '', assignedTo: '', dueDate: '' }])}
          >
            Добавить задачу
          </button>
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Бюджет: Доходы</label>
          <input
            type="number"
            className="dashboard__input-number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>
        <div className="dashboard__form-group">
          <label className="dashboard__label">Бюджет: Расходы</label>
          <input
            type="number"
            className="dashboard__input-number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
          />
        </div>
        <button type="submit" className="dashboard__button">Создать мероприятие</button>
      </form>
    </div>
  );
}
