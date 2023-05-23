'use strict'

const express = require('express')
const productCtrl = require('../controllers/products')
const orderCtrl = require('../controllers/orders')
const userCtrl = require('../controllers/user')
const authCtrl = require('../controllers/auth')
const auth = require('../middlewares/auth')
const api = express.Router()

// Productos
api.get('/products', auth.isAuth, productCtrl.getProducts)
api.get('/products/:productId', auth.isAuth, productCtrl.getProduct)
api.post('/products', auth.isAuth, productCtrl.saveProduct)
api.patch('/products/:productId', auth.isAuth, productCtrl.updateProduct)
api.delete('/products/:productId', auth.isAuth, productCtrl.deleteProduct)

// Órdenes
api.get('/orders', auth.isAuth, orderCtrl.getOrders)
api.get('/orders/:orderId', auth.isAuth, orderCtrl.getOrder)
api.post('/orders', auth.isAuth, orderCtrl.saveOrder)
api.patch('/orders/:orderId', auth.isAuth, orderCtrl.updateOrder)
api.delete('/orders/:orderId',  auth.isAuth, orderCtrl.deleteOrder)

// Usuarios
api.get('/users', auth.isAuth, auth.isAdmin, userCtrl.getUsers)
api.get('/users/:userId', auth.isAuth, auth.isAdmin, userCtrl.getUser)
api.post('/users', auth.isAuth, auth.isAdmin, userCtrl.signUp)
api.patch('/users/:userId', auth.isAuth, auth.isAdmin,userCtrl.updateUser)
api.delete('/users/:userId', auth.isAuth, auth.isAdmin, userCtrl.deleteUser)

// Autenticación
api.post('/login', (req, res) => {
    authCtrl.signIn(req, res)
      .then((result) => {
        res.status(result.status).send(result);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  });

module.exports = api