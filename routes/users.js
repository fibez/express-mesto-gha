const router = require('express').Router();

const {
  getAllUsers,
  getuserBuId,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/users', auth, getAllUsers);
router.get('/users/:id', auth, getuserBuId);
router.patch('/users/me', auth, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
