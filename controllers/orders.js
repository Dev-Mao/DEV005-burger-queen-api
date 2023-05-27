'use strict'

const Order = require('../models/order');
const User = require('../models/user')
const Product = require('../models/product')
const service = require('../services/index');

function getOrder(req, res) {
  let orderId = req.params.orderId;

  Order.findById(orderId)
    .populate('products.product') // Utilizar "populate" para obtener los detalles del producto
    .then((order) => {
      if (!order) {
        return res.status(404).send({ message: 'La orden no existe' });
      }
      res.status(200).send({ order });
    })
    .catch((error) => {
      return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
    });
}



function getOrders (req, res){
    Order.find({})
    .populate('products.product')
    .then((orders) => {
        if (!orders) {
          return res.status(404).send({ message: 'No existen órdenes' });
        }
  
        res.status(200).send({ orders });
      })
      .catch((error) => {
        return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
      });
}

function saveOrder(req, res) {
  let client = req.body.client;
  let products = req.body.products;

  const token = req.headers.authorization.split(' ')[1];

  service.decodeToken(token)
    .then((payload) => {
      const userId = payload.sub;

      // Verificar que el ID de usuario existe
      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: 'El usuario no existe' });
          }

          // Verificar que los IDs de los productos existen
          const productIds = products.map((product) => product.productId);
          Product.find({ _id: { $in: productIds } })
            .then((foundProducts) => {
              if (foundProducts.length !== productIds.length) {
                return res.status(400).send({ message: 'Algunos productos no existen' });
              }

              // Crear y guardar la orden
              let order = new Order();
              order.userId = userId;
              order.client = client;
              order.products = products.map((product) => {
                return {
                  qty: product.qty,
                  product: product.productId
                };
              });
              order.status = req.body.status;

              order.save()
                .then((orderStored) => {
                  res.status(200).send({ order: orderStored });
                })
                .catch((err) => {
                  res.status(400).send({ message: `Error al guardar en la base de datos: ${err}` });
                });
            })
            .catch((err) => {
              return res.status(400).send({ message: `Error al realizar la verificación de productos:  ${err}` });
            });
        })
        .catch((err) => {
          return res.status(400).send({ message: `Error al realizar la verificación de usuario:  ${err}` });
        });
    })
    .catch((response) => {
      res.status(response.status);
    });
}


function updateOrder(req, res) {
  let orderId = req.params.orderId;
  let update = req.body;

  if (update.status === 'delivered') {
    update.deliveryDate = new Date(); // Guardar la fecha actual como fecha de entrega
  }

  Order.findByIdAndUpdate(orderId, update)
    .then((orderUpdate) => {
      if (update.status === 'delivered') {
        orderUpdate.deliveryDate = update.deliveryDate; // Actualizar la fecha de entrega en la respuesta
      }
      res.status(200).send({ order: orderUpdate });
    })
    .catch((err) => {
      return res.status(500).send({ message: `Error al actualizar la orden: ${err}` });
    });
}

function deleteOrder (req, res){
    let orderId = req.params.orderId
    Order.deleteOne({_id: orderId})
    .then(() => {
      res.status(200).send({ message: 'La orden ha sido eliminada' });
    })
    .catch((err) => {
      return res.status(500).send({ message: `Error al eliminar la orden: ${err}` });
    });
}



module.exports = {
    getOrder,
    getOrders,
    saveOrder,
    updateOrder,
    deleteOrder,
}