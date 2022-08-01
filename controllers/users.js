const User = require('../models/user');
const { defaultError, UnauthorizedError, DocumentNotFoundError } = require('../utils/errors');

// Возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(defaultError).send({ message: 'Произошла ошибка' }));
};

// Возвращает пользователя по _id
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(UnauthorizedError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

// Создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UnauthorizedError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

// Обновляет профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UnauthorizedError).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

// Обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UnauthorizedError).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};
