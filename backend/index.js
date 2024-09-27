import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/123?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB okey'))
  .catch((err) => console.log('db error', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Модели
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const Event = mongoose.model('Event', new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: String,
  tasks: [{ description: String, assignedTo: String, dueDate: Date, completed: { type: Boolean, default: false } }],
  budget: {
    income: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
  },
}));

// Регистрация пользователя
app.post('/register', async(req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).send({ message: 'Имя занято ' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, password: hashedPassword});
        await user.save();

        res.status(201).send({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Авторизация пользователя

app.post('/login', async(req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send({ message: 'Ощибка в пароле ' });
        }

        res.send({ user });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' }   );
    }
});



// Получение всех мероприятий
app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Создание нового мероприятия
app.post('/events', async (req, res) => {
  const { title, date, location, tasks, budget } = req.body;
  const event = new Event({ title, date, location, tasks, budget });
  await event.save();
  res.status(201).json(event);
});

// Обновление бюджета мероприятия
app.put('/events/:id/budget', async (req, res) => {
  const { income, expenses } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, { budget: { income, expenses } }, { new: true });
  res.json(event);
});

// Создание задачи для мероприятия
app.post('/events/:id/tasks', async (req, res) => {
  const { description, assignedTo, dueDate } = req.body;
  const event = await Event.findById(req.params.id);
  event.tasks.push({ description, assignedTo, dueDate });
  await event.save();
  res.status(201).json(event);
});

// Обновление статуса задачи
app.put('/events/:eventId/tasks/:taskId', async (req, res) => {
  const { completed } = req.body;
  const event = await Event.findById(req.params.eventId);
  const task = event.tasks.id(req.params.taskId);
  if (task) {
    task.completed = completed;
    await event.save();
    res.json(event);
  } else {
    res.status(404).send('Task not found');
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
