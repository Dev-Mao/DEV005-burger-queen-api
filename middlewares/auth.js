'use strict'
const service = require('../services/index')

function isAuth (req, res, next) {

    if(!req.headers.authorization){
        return res.status(403).send({ message: 'No tienes autorización'})
    }

    const token = req.headers.authorization.split(' ')[1]

    service.decodeToken(token)
    .then(payload  => {
        req.role = payload.role
        req.user = payload.sub 
        next()
    })
    .catch(response => {
        res.status(response.status)
    })
}

function isAdmin(req, res, next) {
    if (req.role === 'admin') {
      return next();
    } else {
      return res.status(403).send({ message: 'No tienes autorización como administrador' });
    }
  }
  
  
  module.exports = {
    isAuth,
    isAdmin
  };