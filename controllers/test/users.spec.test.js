const User = require('../../models/user');
const { getUser, getUsers, signUp, updateUser, deleteUser } = require('../../controllers/user'); 

describe('getUser', () => {
    const req = { params: { userIdOrEmail: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
    it('should return a user with the correct id', async () => {
      const mockUser = {
        _id: '123',
        email: 'John@prueba.com'
      };
  
      // Mock de la función `User.findOne`
      User.findOne = jest.fn().mockResolvedValue(mockUser);
  
      await getUser(req, res);
  
      // Verificar que la respuesta tenga un código de estado 200
      expect(res.status).toHaveBeenCalledWith(200);
      // Verificar que User.findOne sea llamado con la condición de búsqueda correcta
      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' });
      // Verificar que res.send sea llamado con el usuario correcto
      expect(res.send).toHaveBeenCalledWith({ user: mockUser });
    });
  
    it('should return error 404 if the user does not exist', async () => {
      // Mock de la función `User.findOne` que devuelve null
      User.findOne = jest.fn().mockResolvedValueOnce(null);
  
      await getUser(req, res);
  
      // Verificar que la respuesta tenga un código de estado 404
      expect(res.status).toHaveBeenCalledWith(404);
    });
  
    it('should return error 500', async () => {
      const error = new Error('Error de prueba');
      // Agregar un mock para User.findOne que devuelve un error
      User.findOne = jest.fn().mockRejectedValue(error);
      
      try{
        await getUser(req, res);
      } catch{
        // Verificar que User.findOne sea llamado con la condición de búsqueda correcta
      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' });
      // Verificar que la respuesta tenga un código de estado 500
      expect(res.status).toHaveBeenCalledWith(500);
      // Verificar que la respuesta tenga un mensaje de error
      expect(res.send).toHaveBeenCalledWith({ message: `Error al realizar la petición: ${error}` });
      }
      
  
      
    });
  });
  

describe('getUsers', () => {
    it('should return status 200 and the list of users', async () => {
        const mockUser = {
            _id: '123',
            name: 'John@prueba.com'
        };
        // Agregar un mock para User.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        User.find= jest.fn().mockResolvedValueOnce(mockUser);
        // Llamar a la función getUsers con una solicitud y una respuesta simuladas
        const req = { params: { } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getUsers(req, res);
    
        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Verificar que user.find sea llamado
        expect(User.find).toHaveBeenCalled();
        // Verificar que la respuesta tenga la orden
        expect(res.send).toHaveBeenCalledWith({ users: mockUser });
    });

    it('should return error 404  if there is no users', async () => {
        // Agregar un mock para User.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        User.find = jest.fn().mockResolvedValueOnce(null);
        // Llamar a la función getProducts con una solicitud y una respuesta simuladas
        const req = { };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getUsers(req, res);
        // Verificar que la respuesta tenga un código de estado 404
        expect(res.status).toBeCalledWith(404);
    });

    it('should return error 500  if there is an error', async () => {
        const error = new Error('Error de prueba');
        // Agregar un mock para User.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        User.find = jest.fn().mockRejectedValue(error);
        // Llamar a la función getUsers con una solicitud y una respuesta simuladas
        const req = { };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        try {
            await getUsers(req, res);
        } catch {
            // Verificar que la respuesta tenga un código de estado 404
            expect(res.status).toBeCalledWith(500);
        }
    });
})


describe('signUp', () => {
    const req = {
        body: {
          email: 'admin@admin.co',
          password: 'admin',
          role: 'admin',
        }
    };
  
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
    it('should save the user with valid information', async () => {
        const mockSavedUser= {
          _id: 'productId',
          email: 'admin@admin.co',
          password: 'admin',
          role: 'admin',
        };

        User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);
    
        await signUp(req, res);
        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should send an error 500 if there is an error', async () => {
        const error =  new Error('Error de prueba');

        User.prototype.save = jest.fn().mockRejectedValue(error);
        
        try {
            await signUp(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
      });
})

describe('updateUser', () => {
    const req = {
        params: {
          userId: '12345'
        }
      };
    
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

    it('should send a status 200 if update a user', async () => {
        User.findByIdAndUpdate = jest.fn().mockResolvedValue();
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    })

    it('should send a status 500 if there is an error updating the user', async () => {
        const error =  new Error('Error de prueba');
        User.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
        try {
            await updateUser(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
    })
})

describe('deleteUser', () => {
    const req = {
        params: {
          userId: '12345'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
 
    it('should send a status 200 when the user has been deleted', async () => {

        User.deleteOne = jest.fn().mockResolvedValue();
        // Llamar a la función
        await deleteUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    })

    it('should send a status 500 when there is a error deleting the user', async () => {

        User.deleteOne = jest.fn().mockRejectedValue();
        // Llamar a la función
        try {
            await deleteUser(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
    })
})
