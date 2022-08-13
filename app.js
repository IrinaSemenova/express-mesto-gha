const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./error/not-found-error');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(routerUsers);
app.use(routerCards);
app.use(errors()); // обработчики ошибок

app.all('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
