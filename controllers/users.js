const User = require('../models/user');
const {
  isFieldEmpty,
} = require('../utils/validation');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

async function getAllUsers(req, res) {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка при получении пользователей' });
  }
}

async function getuserBuId(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }
    return res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный идентификатор пользователя' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка при получении пользователя' });
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;

    if (isFieldEmpty({ name, about, avatar })) {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Одно из обязательных полей не заполнено' });
    }

    const newUser = await User.create({
      name,
      about,
      avatar,
    });

    return res.json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка при создании пользователя' });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (isFieldEmpty({ name, about })) {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Одно из обязательных полей не заполнено' });
    }

    if (!updatedUser) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка при обновлении профиля' });
  }
}

async function updateAvatar(req, res) {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (isFieldEmpty({ avatar })) {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Одно из обязательных полей не заполнено' });
    }

    if (!updatedUser) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка при обновлении аватара' });
  }
}

module.exports = {
  getAllUsers,
  getuserBuId,
  createUser,
  updateProfile,
  updateAvatar,
};
