import { useSelector } from "react-redux";
import { useState } from "react";

export default function Dashboard() {
  const user = useSelector((state) => state.user.user); // Текущий пользователь из Redux
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tasks, setTasks] = useState([{ description: '', assignedTo: '', dueDate: '' }]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  console.log(user.name);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      date,
      location,
      tasks,
      budget: { income, expenses },
      createdBy: user.name // Добавляем поле createdBy с именем текущего пользователя
    };
   
    
    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      if (response.ok) {
        alert('Мероприятие успешно добавлено');
        // Сбрасываем поля формы
        setTitle('');
        setDate('');
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
      <h1>Личный кабинет пользователя: {user.name}</h1>
      <hr />
      <h3>Добавить мероприятие</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название мероприятия:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Дата мероприятия:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Место проведения:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Задачи:</label>
          {tasks.map((task, index) => (
            <div key={index}>
              <input
                type="text"
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
                placeholder="Срок выполнения"
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
            onClick={() =>
              setTasks([...tasks, { description: '', assignedTo: '', dueDate: '' }])
            }
          >
            Добавить задачу
          </button>
        </div>
        <div>
          <label>Бюджет: Доходы</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Бюджет: Расходы</label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
          />
        </div>
        <button type="submit">Создать мероприятие</button>
      </form>
    </div>
  );
}
