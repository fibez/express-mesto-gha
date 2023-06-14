const router = require('express').Router();

const {
  getAllUsers,
  getuserBuId,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getuserBuId);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
