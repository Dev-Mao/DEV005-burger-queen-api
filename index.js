// app.js
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

const port = process.argv[2] || config.port || 8080;

async function connectToDatabase() {
  try {
    await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
      console.log('Conexión a la base de datos establecida');
    return true;
  } catch (err) {
      console.log(`Error al conectar la base de datos: ${err}`);
    return false;
  }
}

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`api en http://localhost:${port}`);
  });
  return server;
};

connectToDatabase()
startServer(port)

module.exports = { connectToDatabase, startServer };
