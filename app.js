'use strict'

const express = require('express')
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Implementar la función root
const root = (req, res, next) => {
  const pkg = app.get('pkg');
  res.json({ name: pkg.name, version: pkg.version });
};

app.get('/', root);

module.exports = app;