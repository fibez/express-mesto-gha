const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.post('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
