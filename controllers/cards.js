const Card = require('../models/card');

async function getAllCards(req, res) {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка при получении карточек' });
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: 'Одно из обязательных полей не заполнено' });
    }

    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id,
    });

    return res.json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    }

    return res.status(500).json({ message: 'Произошла ошибка при создании карточки' });
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findById(cardId);

    if (card.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Нельзя удалять чужие карточки' });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    return res.json(deletedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректный идентификатор карточки' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при удалении карточки' });
  }
}

async function likeCard(req, res) {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      res.status(404).json({ message: 'Карточка не найдена' });
    } else {
      res.json(updatedCard);
    }
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка при добавлении лайка карточке' });
  }
}

async function dislikeCard(req, res) {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      res.status(404).json({ message: 'Карточка не найдена' });
    } else {
      res.json(updatedCard);
    }
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка при удалении лайка с карточки' });
  }
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
