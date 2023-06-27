const Card = require('../models/card');

const BadRequestError = require('../utils/errors/BadRequest');
const NotFoundError = require('../utils/errors/NotFound');
const ForbiddenError = require('../utils/errors/Forbidden');

async function getAllCards(req, res, next) {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (error) {
    return next(error);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      throw new BadRequestError('Одно из обязательных полей не заполнено');
    }

    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id,
    });

    return res.json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные');
    }
    return next(error);
  }
}

async function deleteCard(req, res, next) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('У вас нет прав для удаления этой карточки');
    }

    await Card.deleteOne({ _id: cardId });

    return res.json(card);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Некорректный идентификатор карточки');
    }
    return next(error);
  }
}

async function likeCard(req, res, next) {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.status(200).json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Некорректный идентификатор карточки');
    }
    return next(error);
  }
}

async function dislikeCard(req, res, next) {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Некорректный идентификатор карточки');
    }
    return next(error);
  }
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
