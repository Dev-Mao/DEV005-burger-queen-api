const User = require('../models/user')
const service = require('../services/index')

// Iniciar con usuario existente
const signIn = (req, res) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: req.body.email })
        .select('_id email role +password')
        .exec()
        .then((user) => {
          if (!user) {
            return reject({ status: 404, message: `No existe el usuario: ${req.body.email}` })
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              return reject({ status: 500, message: `Error al ingresar: ${err}` })
            }
            if (!isMatch) {
              return reject({ status: 404, message: `Error de contraseña: ${req.body.email}` })
            }
            req.user = user
            resolve({ status: 200, message: 'Te has logueado correctamente', token: service.createToken(user) })
          })
        })
        .catch((err) => {
          reject({ status: 500, message: `Error al ingresar: ${err}` })
        })
    })
  }

module.exports = {
    signIn
}