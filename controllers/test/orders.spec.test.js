const Order = require('../../models/order');
const User = require('../../models/user');
const Product = require('../../models/product');
const service = require('../../services/index');
const { getOrder, getOrders, saveOrder, updateOrder, deleteOrder } = require('../../controllers/orders'); 
const request = require('supertest');
const app = require('../../app');

jest.mock('../../services/index');
jest.mock('../../models/user');
jest.mock('../../models/product');
jest.mock('../../models/order');


describe('getOrder', () => {
    it('should return an order with populated products', async () => {
        const mockOrder = {
          _id: '123',
          products: [{ product: '456', qty: 2 }]
        };
        // Agregar un mock para Order.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Order.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockOrder)
        });
        // Llamar a la función getOrder con una solicitud y una respuesta simuladas
        const req = { params: { orderId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getOrder(req, res);

        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toBeCalledWith(200);
        // Verificar que order.findById sea llamado con el id correcto
        expect(Order.findById).toHaveBeenCalledWith('123');
        expect(res.send).toBeCalledWith({ order: mockOrder });
      });

      it('should return error 404  if the order does not exist', async () => {
        // Agregar un mock para Order.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Order.findById = jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockResolvedValue(null)
        });
        // Llamar a la función getOrder con una solicitud y una respuesta simuladas
        const req = { params: { orderId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getOrder(req, res);
        // Verificar que la respuesta tenga un código de estado 404
        expect(res.status).toBeCalledWith(404);
      });

      it('should return error 500', async () => {
        const error = new Error('Error de prueba');
        // Agregar un mock para Order.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Order.findById = jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockRejectedValue(error)
        });
      
        // Llamar a la función getOrder con una solicitud y una respuesta simuladas
        const req = { params: { orderId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      
        try {
          await getOrder(req, res);
        } catch {
          // Verificar que order.findById sea llamado con el id correcto
          expect(Order.findById).toHaveBeenCalledWith('123');
          // Verificar que la respuesta tenga un código de estado 500
          expect(res.status).toHaveBeenCalledWith(500);
          // Verificar que la respuesta tenga un mensaje de error
          expect(res.send).toHaveBeenCalledWith({ message: `Error al realizar la petición: ${error}` });
        }
      });
});

describe('getOrders', () => {
  it('should return orders with populated products', async () => {
      const mockOrder = {
        _id: '123',
        products: [{ product: '456', qty: 2 }]
      };
      // Agregar un mock para Order.findById que devuelve una promesa resuelta con el objeto de pedido simulado
      Order.find= jest.fn().mockReturnValueOnce({
           populate: jest.fn().mockResolvedValue(mockOrder)
      });
      // Llamar a la función getOrders con una solicitud y una respuesta simuladas
      const req = { params: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await getOrders(req, res);

      // Verificar que la respuesta tenga un código de estado 200
      expect(res.status).toBeCalledWith(200);
      // Verificar que order.find sea llamado
      expect(Order.find).toHaveBeenCalled();
        // Verificar que la respuesta tenga la orden
      expect(res.send).toBeCalledWith({ orders: mockOrder });
    });

    it('should return error 404  if there is no orders', async () => {
      // Agregar un mock para Order.findById que devuelve una promesa resuelta con el objeto de pedido simulado
      Order.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null)
      });
      // Llamar a la función getOrders con una solicitud y una respuesta simuladas
      const req = { };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await getOrders(req, res);
      // Verificar que la respuesta tenga un código de estado 404
      expect(res.status).toBeCalledWith(404);
    });

    it('should return error 500 if there is an error', async () => {
      // Agregar un mock para Order.find que devuelve una promesa rechazada con un objeto con la función populate
      Order.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockRejectedValueOnce(new Error('Error de prueba'))
      });
    
      // Llamar a la función getOrders con una solicitud y una respuesta simuladas
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    
      try {
        await getOrders(req, res);
      } catch {
        // Verificar que la respuesta tenga un código de estado 500
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
    
    
});

describe('saveOrder', () => {

  it('should save the order with valid information', async () => {
    const req = {
      body: {
        client: 'John Doe',
        products: [
          { productId: 'product1', qty: 2 },
          { productId: 'product2', qty: 3 }
        ],
        status: 'pending'
      },
      headers: {
        authorization: 'Bearer token'
      }
    };

    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    const tokenPayload = { sub: 'userId' };
    service.decodeToken.mockResolvedValue(tokenPayload);

    const mockUser = { _id: 'userId' };
    User.findById.mockResolvedValue(mockUser);

    const mockProducts = [
      { _id: 'product1', name: 'Product 1' },
      { _id: 'product2', name: 'Product 2' }
    ];
    Product.find= jest.fn().mockReturnValueOnce(mockProducts);

    const mockSavedOrder = {
      _id: 'orderId',
      userId: 'userId',
      client: 'John Doe',
      products: [
        { qty: 2, product: 'product1' }
      ],
      status: 'pending'
    };
    Order.prototype.save.mockResolvedValue(mockSavedOrder);

    await saveOrder(req, res);

    expect(service.decodeToken).toHaveBeenCalledWith('token');
    expect(User.findById).toHaveBeenCalledWith('userId');
  });

  it('should return 404 if user does not exist', async () => {
    service.decodeToken.mockResolvedValue({ sub: 'nonexistent-user-id' });
    User.findById.mockResolvedValue(null);
  
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer test-token')
      .send({
        client: 'Test client',
        products: [{ productId: 'product1', qty: 1 }],
        status: 'pending',
      });
  
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('El usuario no existe');
  });

  it('should return 400 if order status is not provided and user exists', async () => {
    service.decodeToken.mockResolvedValue({ sub: 'existing-user-id' });
    User.findById.mockResolvedValue({ _id: 'existing-user-id' });
  
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer test-token')
      .send({
        client: 'Test client',
        products: [{ productId: 'product1', qty: 1 }],
      });
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Error al realizar la verificación de usuario:  TypeError: Cannot read properties of undefined (reading 'then')");
  });
  
  it('should save the order and return 200 with the saved order when all products exist and user exists', async () => {
    service.decodeToken.mockResolvedValue({ sub: 'existing-user-id' });
    User.findById.mockResolvedValue({ _id: 'existing-user-id' });
    Product.find.mockResolvedValue([{ _id: 'product1' }]);
  
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer test-token')
      .send({
        client: 'Test client',
        products: [{ productId: 'product1', qty: 1 }],
      });
  
    expect(res.status).toBe(200);
    expect(res.body.order).toEqual({
      _id: 'orderId',
      userId: 'userId',
      client: 'John Doe',
      products: [{ qty: 2, product: 'product1' }],
      status: 'pending',
    });
  });
});


describe('updateOrder',  () => {
  const req = {
    params: {
      orderId: '12345'
    },
    body: {
      status: 'delivered'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };

  it('should update order and send a status 200', async () => {   
    // Mock de la función `Order.findByIdAndUpdate`   
    Order.findByIdAndUpdate.mockResolvedValue({
      status: 'delivered'
    });    
    // Llamar a la función    
    await updateOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(200);   
  });

  it('should send a status 500 if there is an error', async () => {
    
    // Mock de la función `Order.findByIdAndUpdate`
    const error =  new Error('Error de prueba');
    Order.findByIdAndUpdate.mockRejectedValue(error);  
  
    // Llamar a la función   
    try{
      await updateOrder(req, res)
    } catch{
      expect(res.status).toHaveBeenCalledWith(500); 
    }
  });  
});

describe('deleteOrder', () => { 
  const req = {
    params: {
      orderId: '12345'
    }
  }
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  }
  it('should send a status 200 when the order has been deleted', async () => {
    // Mock de la función `Order.deleteOne`
    Order.deleteOne.mockResolvedValue(true);

    // Llamar a la función
    await deleteOrder(req, res)

    expect(Order.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
    expect(res.status).toHaveBeenCalledWith(200);
  
  });

  it('should send a status 500 when there is an error deleting the order', async () => {
  
    const expectedError = 'error';
  
    // Cambiar la implementación de la función `Order.deleteOne`
    Order.deleteOne.mockRejectedValue(expectedError);
  
    try {
      // Llamar a la función
      await deleteOrder(req, res);
    } catch (err) {
      expect(Order.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(err).toEqual(expectedError);
    }
  });
});  
