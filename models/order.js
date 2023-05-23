'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true
    },
    client: String,
    products: [{
      qty: { 
        type: Number, 
        required: true 
      },              
      product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      }
    }],
    status: { 
        type: String, 
        enum: ['pending', 'canceled', 'delivering', 'delivered'], 
        default: 'pending' 
    },
    dataEntry: { 
        type: Date, 
        default: Date.now()
    },
    deliveryDate: { 
        type: Date
    },
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  