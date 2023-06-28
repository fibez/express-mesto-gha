const router = require('express').Router();

const {
  getCurrentUser,
  getAllUsers,
  getuserBuId,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  userIdValidator,
  userNameAboutValidator,
  userAvatarUrlValidator,
} = require('../middlewares/celebrateValidation');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getAllUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:id', auth, userIdValidator, getuserBuId);
router.patch('/me', auth, userNameAboutValidator, updateProfile);
router.patch('/me/avatar', auth, userAvatarUrlValidator, updateAvatar);

module.exports = router;
