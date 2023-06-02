'use strict'

const productCtrl = require('../controllers/products')
const orderCtrl = require('../controllers/orders')
const userCtrl = require('../controllers/user')
const authCtrl = require('../controllers/auth')
const auth = require('../middlewares/auth')
const express = require('express')
const router = express.Router();


// Productos
router.get('/products', auth.isAuth, productCtrl.getProducts)
router.get('/products/:productId', auth.isAuth, productCtrl.getProduct)
router.post('/products', auth.isAuth, auth.isAdmin, productCtrl.saveProduct)
router.patch('/products/:productId', auth.isAuth, auth.isAdmin, productCtrl.updateProduct)
router.delete('/products/:productId', auth.isAuth,  auth.isAdmin, productCtrl.deleteProduct)

// Órdenes
router.get('/orders', auth.isAuth, orderCtrl.getOrders)
router.get('/orders/:orderId', auth.isAuth, orderCtrl.getOrder)
router.post('/orders', auth.isAuth, orderCtrl.saveOrder)
router.patch('/orders/:orderId', auth.isAuth, orderCtrl.updateOrder)
router.delete('/orders/:orderId',  auth.isAuth, orderCtrl.deleteOrder)

// Usuarios
router.get('/users', auth.isAuth, auth.isAdmin, userCtrl.getUsers)
router.get('/users/:userIdOrEmail', auth.isAuth, auth.isAdmin, userCtrl.getUser)
router.post('/users', auth.isAuth, auth.isAdmin, userCtrl.signUp)
router.patch('/users/:userId', auth.isAuth, auth.isAdmin,userCtrl.updateUser)
router.delete('/users/:userId', auth.isAuth, auth.isAdmin, userCtrl.deleteUser)

// Importa tu middleware de manejo de errores
const errorHandlerMiddleware = require('../middlewares/error');


// Registra tu middleware de manejo de errores aquí (debe ser el último middleware registrado)
router.use(errorHandlerMiddleware);

// Autenticación
router.post('/login', (req, res) => {
  authCtrl.signIn(req, res)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

module.exports = router

