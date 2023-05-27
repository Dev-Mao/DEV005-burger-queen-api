'use strict'

const Product = require('../models/product')
function getProduct (req, res){
    let productId = req.params.productId

    Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send({ message: 'El producto no existe' });
      }
      res.status(200).send({ product });
    })
    .catch((error) => {
      return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
    });
}
function getProducts (req, res){
    Product.find({})
    .then((products) => {
        if (!products) {
          return res.status(404).send({ message: 'No existen productos' });
        }
  
        res.status(200).send({ products });
      })
      .catch((error) => {
        return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
      });
}

function saveProduct (req, res) {

    let product = new Product()
    product.name = req.body.name
    product.price = req.body.price
    product.image = req.body.image
    product.type = req.body.type

    product.save()
    .then(productStored => {
        res.status(200).send({product: productStored})
    })
    .catch(err => {
        res.status(500).send({ message: `Error al guardar en la base de datos: ${err}`})
    })
}
function updateProduct (req, res){
    let productId = req.params.productId
    let update = req.body

    Product.findByIdAndUpdate(productId, update)
    .then((productUpdate) => {
        res.status(200).send({ product: productUpdate });
      })
      .catch((error) => {
        return res.status(500).send({ message: `Error al actualizar el producto: ${error}` });
      });
}
function deleteProduct (req, res){
    let productId = req.params.productId
    Product.deleteOne({_id: productId})
    .then(() => {
      res.status(200).send({ message: 'El producto ha sido eliminado' });
    })
    .catch((error) => {
      return res.status(500).send({ message: `Error al eliminar el producto: ${error}` });
    });
}

module.exports = {
    getProduct,
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
}