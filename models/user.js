const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const NotAuthorizationError = require('../error/notauthorization-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: [2, 'Поле должно быть не менее 2-ух символов'],
    maxlength: [30, 'Поле должно быть не более 30-ти символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: [2, 'Поле должно быть не менее 2-ух символов'],
    maxlength: [30, 'Поле должно быть не более 30-ти символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator(url) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(url);
      },
      message: 'Некорректный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthorizationError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizationError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
