const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.json());

app.use((req, res, next) => {
  req.user={
    _id: '62e471fab1de8b8176409008'
  };

  next();
});

app.use(routerUsers);
app.use(routerCards);

app.use((req, res) => {
  res.status(404).send({ message: 'Cтраница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});