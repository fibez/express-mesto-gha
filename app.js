const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');
const {
  userSchemaSignupValidator,
  userSchemaSigninValidator,
} = require('./middlewares/celebrateValidation');
const { errorHandler } = require('./utils/errors/ErrorHandler');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.post('/signup', userSchemaSignupValidator, createUser);
app.post('/signin', userSchemaSigninValidator, login);
app.use(userRouter);
app.use(cardRouter);
app.use(errors());
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Неправильный путь' });
});

app.listen(PORT, () => {});
