const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectReqError = require('../error/incorrect-req-error');
const ConflictError = require('../error/conflict-error');
const NotAuthorizationError = require('../error/notauthorization-error');
const NotFoundError = require('../error/not-found-error');

// Возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(() => {
      throw new NotAuthorizationError('Неправильные почта или пароль');
    })
    .catch(next);
};

// получение информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// Создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((userConflict) => {
      if (userConflict) {
        throw new ConflictError('Указанный email занят');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }))
          .then(() => res.send({
            name, about, avatar, email,
          }));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// Возвращает пользователя по _id
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// Обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// Обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};
