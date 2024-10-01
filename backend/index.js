import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 5000;


mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/123?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB okey'))
  .catch((err) => console.log('db error', err));


app.use(cors());
app.use(bodyParser.json());


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
  createdBy: { type: String, required: true }, 
  img: { type: String },
  eventType: { type: String, required: true, enum: ['webinar', 'forum', 'conference', 'dinner', 'exhibition', 'training'] } // Добавляем поле eventType
}));


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



app.get('/events', async (req, res) => {
  const { eventType } = req.query;
  let query = {};

  if (eventType && eventType !== 'all') {
    query.eventType = eventType; 
  }

  try {
    const events = await Event.find(query); 
    res.json(events);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при получении мероприятий' });
  }
});


app.post('/events', async (req, res) => {
  const { title, date, location, tasks, budget, createdBy, img, eventType } = req.body; 
  const event = new Event({ title, date, location, tasks, budget, createdBy, img, eventType }); 
  try {
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при создании мероприятия' });
  }
});



app.post('/events/:id/tasks', async (req, res) => {
  const { description, assignedTo, dueDate } = req.body;
  const event = await Event.findById(req.params.id);
  event.tasks.push({ description, assignedTo, dueDate });
  await event.save();
  res.status(201).json(event);
});


app.delete('/events/:id', async (req, res) => {
  const { userName } = req.body; 
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).send({ message: 'Мероприятие не найдено' });
  }


  if (event.createdBy === userName || userName === 'admin') {
    await Event.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'Мероприятие удалено' });
  } else {
    res.status(403).send({ message: `У вас нет прав на удаление этого мероприятия ${event.createdBy}` });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
