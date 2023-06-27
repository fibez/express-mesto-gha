const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { auth } = require('../middlewares/auth');
const {
  cardDataValidator,
  cardIdValidator,
} = require('../middlewares/celebrateValidation');

router.get('/cards', auth, getAllCards);
router.post('/cards', auth, cardDataValidator, createCard);
router.delete('/cards/:cardId', auth, cardIdValidator, deleteCard);
router.put('/cards/:cardId/likes', auth, cardIdValidator, likeCard);
router.delete('/cards/:cardId/likes', auth, cardIdValidator, dislikeCard);

module.exports = router;
