const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const url = require('./utils/urlPattern');

const {
  createUser,
  login,
} = require('./controllers/users');
const { errorHandler } = require('./utils/errors/ErrorHandler');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(url),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use(userRouter);
app.use(cardRouter);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Неправильный путь' });
});

app.listen(PORT, () => {});
