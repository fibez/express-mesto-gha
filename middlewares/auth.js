const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Отсутствует токен авторизации' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret_key');
  } catch (err) {
    return res.status(401).json({ error: 'Неверный токен авторизации' });
  }

  req.user = payload;
  return next();
}

module.exports = { auth };
