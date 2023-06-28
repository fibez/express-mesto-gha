const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');

const BadRequestError = require('../utils/errors/BadRequest');
const ConflictError = require('../utils/errors/Conflict');
const NotFoundError = require('../utils/errors/NotFound');
const UnauthorizedError = require('../utils/errors/Unauthorized');

async function getAllUsers(req, res, next) {
  try {
    const users = await user.find();

    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

async function getuserBuId(req, res, next) {
  try {
    const foundUser = await user.findById(req.params.id);

    if (!foundUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.json(foundUser);
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const responseData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      about: newUser.about,
      avatar: newUser.avatar,
    };

    return res.status(201).json(responseData);
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
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

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
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

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
    const foundUser = await user.findOne({ email }).select('+password');

    if (!foundUser) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const token = jwt.sign({ _id: foundUser._id }, 'secret_key', { expiresIn: '7d' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });

    return res.status(200).json({ message: 'Вы успешно авторизованы' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при авторизации'));
    }
    return next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.json(foundUser);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCurrentUser,
  getAllUsers,
  getuserBuId,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
