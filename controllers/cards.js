const Card = require('../models/card');
const ForbiddenError = require('../error/forbidden-error');
const NotFoundError = require('../error/not-found-error');
const IncorrectReqError = require('../error/incorrect-req-error');

// Возвращает все карточки
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// Удаляет карточку по _id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление данной карточки');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectReqError('Переданы некорректные данные'));
        return;
      } next(err);
    });
};
