const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/Unauthorized');

async function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Отсутствует токен авторизации'));
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret_key');
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }
}

module.exports = { auth };
