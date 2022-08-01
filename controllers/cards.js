const Card = require('../models/card');
const { defaultError, UnauthorizedError, DocumentNotFoundError } = require('../utils/errors');

// Возвращает все карточки
module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(defaultError).send({ message: 'Произошла ошибка' }));
};

// Создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UnauthorizedError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

// Удаляет карточку по _id
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемый карточка не найдена' });
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

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемая карточка не найдена' });
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

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемая карточка не найдена' });
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
