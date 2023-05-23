'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = Schema({
    name: String,
    price: String,
    image: String,
    type: String,
    dataEntry: { type: Date, default: Date.now()},
})

module.exports = mongoose.model('Product', productSchema)
