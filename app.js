'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const api = require('./routes/index')
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use('/api', api)

module.exports = app;