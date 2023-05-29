const { startServer, connectToDatabase  } = require('../index');
const app = require('../app')
const mongoose = require('mongoose');
const config = require('../config');


jest.mock('../app')

describe('startServer', () => {
    const port = 3000;
  
    it('should call app.listen', () => {
      app.listen = jest.fn()
  
      startServer(port);
  
      expect(app.listen).toHaveBeenCalled();
      
    });

    test('Console log should have been called', () => {
      const logSpy = jest.spyOn(global.console, 'log');
      const mockPort = 3000;
    
      app.listen = jest.fn((port, callback) => {
        callback();
      });
    
      startServer(mockPort);
    
      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(`api en http://localhost:${mockPort}`);
      
      logSpy.mockRestore();
    });
});




describe('connectToDatabase', () => {
  let originalLog;

  beforeAll(() => {
    originalLog = console.log; // Guardar el comportamiento original de console.log
    console.log = jest.fn(); // Sobrescribir console.log con un mock
  });

  afterAll(() => {
    console.log = originalLog; // Restaurar el comportamiento original de console.log
    mongoose.disconnect(); // Desconectar de la base de datos al final de la prueba
  });

  it('should send a message with conexión exitosa', async () => {
    await connectToDatabase();
    expect(console.log).toHaveBeenCalledWith('Conexión a la base de datos establecida');
  });

  it('should send a message id there is an error with the conection', async () => {
    const error = new Error('Error de conexión');
    mongoose.connect = jest.fn(() => {
      throw error;
    });

    const result = await connectToDatabase();
    expect(console.log).toHaveBeenCalledWith(`Error al conectar la base de datos: ${error}`);
    expect(result).toBe(false);
  });
});



  
  
  
  
  