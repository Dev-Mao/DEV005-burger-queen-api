'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

const port = process.argv[2] || config.port || 8080;


mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
        console.log('Conexión a la base de datos establecida')
        app.listen(port, () => {
            console.log(` api en http://localhost:${port}`)
        })
    }).catch((err) => {
      console.log(`Error al conectar la base de datos: ${err}`);
    });