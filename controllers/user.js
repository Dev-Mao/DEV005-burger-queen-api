'use strict'

const User = require('../models/user')
const service = require('../services/index')

// Registrar un usurio
const signUp = (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  })
    user.save()
  .then(savedUser => {
    return res.status(200).send({ token: service.createToken(savedUser) });
  })
  .catch(error => {
    return res.status(500).send({ message:`Error al crear el usuario: ${error}`});
  });     
}

// Obtener un usuario
function getUser (req, res){
    let userId = req.params.userId

    User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'El usuario no existe' });
      }

      res.status(200).send({ user });
    })
    .catch((error) => {
      return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
    });
}

// Obtener todos los usuarios
function getUsers (req, res){
  User.find({})
    .then((users) => {
        if (!users) {
          return res.status(404).send({ message: 'No existen usuarios' });
        }
  
        res.status(200).send({ users });
      })
      .catch((error) => {
        return res.status(500).send({ message: `Error al realizar la petición: ${error}` });
      });
}


// Actualizar un usuario
function updateUser (req, res){
    let userId = req.params.userIdId
    let update = req.body

    userId.findByIdAndUpdate(userId, update)
    .then((userUpdate) => {
        res.status(200).send({ user: userUpdate });
      })
      .catch((error) => {
        return res.status(500).send({ message: `Error al actualizar el usuario: ${error}` });
      });
}

// Eliminar un usuario
function deleteUser (req, res){
    let userId = req.params.userId
    User.deleteOne({_id: userId})
    .then(() => {
      res.status(200).send({ message: 'El usuario ha sido eliminado' });
    })
    .catch((error) => {
      return res.status(500).send({ message: `Error al eliminar el usuario: ${error}` });
    });
}

module.exports = {
    signUp,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
}