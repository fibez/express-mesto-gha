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

router.get('/users', auth, getAllUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:id', auth, userIdValidator, getuserBuId);
router.patch('/users/me', auth, userNameAboutValidator, updateProfile);
router.patch('/users/me/avatar', auth, userAvatarUrlValidator, updateAvatar);

module.exports = router;
