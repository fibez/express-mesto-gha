const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  isFieldEmpty,
} = require('../utils/validation');

const BadRequestError = require('../utils/errors/BadRequest');
const ConflictError = require('../utils/errors/Conflict');
const NotFoundError = require('../utils/errors/NotFound');
const UnauthorizedError = require('../utils/errors/Unauthorized');

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

async function getuserBuId(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (isFieldEmpty({
      email, password,
    })) {
      throw new BadRequestError('Одно из обязательных полей не заполнено');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('Пользователь с такими данными уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (isFieldEmpty({ name, about })) {
      throw next(new BadRequestError('Одно из обязательных полей не заполнено'));
    }

    if (!updatedUser) {
      throw next(new NotFoundError('Пользователь не найден'));
    }

    return res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (isFieldEmpty({ avatar })) {
      throw new BadRequestError('Одно из обязательных полей не заполнено');
    }

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const token = jwt.sign({ _id: user._id }, 'secret_key', { expiresIn: '7d' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });

    return res.json({ token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(BadRequestError('Некорректные данные при авторизации'));
    }
    return next(error);
  }
}

module.exports = {
  getAllUsers,
  getuserBuId,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
