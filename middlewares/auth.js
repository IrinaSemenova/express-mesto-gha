const jwt = require('jsonwebtoken');
const NotAuthorizationError = require('../error/notauthorization-error');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new NotAuthorizationError('Необходима авторизация');
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new NotAuthorizationError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
