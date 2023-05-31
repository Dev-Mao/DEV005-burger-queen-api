const User = require('../../models/user');
const service = require('../../services/index');
const { signIn } = require('../../controllers/auth');

jest.mock('../../models/user');
jest.mock('../../services/index');

describe('signIn', () => {
    it('should reject with an error 404 if the user does not exist', async () => {
        const req = {
          body: {
            email: 'usuario-inexistente@example.com',
            password: 'contraseña'
          }
        };
        const res = {};
        const expectedError = {
          status: 404,
          message: 'Credenciales no válidas'
        };
      
        // Simular la consulta a la base de datos
        User.findOne = jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          exec: jest.fn().mockReturnValueOnce(Promise.resolve(null))
        });
      
        // Llamar a la función signIn
        try{
          await signIn(req, res)
        } catch {
            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(User.prototype.comparePassword).not.toHaveBeenCalled();
            expect(service.createToken).not.toHaveBeenCalled();
          }
      });
      
      
      it('should reject with error 500 if there is an error', async () => {
        const req = {
          body: {
            email: 'mariana@chef.com',
            password: 'wrong',
          },
        };
      
        const user = {
          _id: 'user_id',
          email: req.body.email,
          role: 'user',
          comparePassword: jest.fn().mockImplementation((password, callback) => {
            callback(new Error('Test error'), null);
          }),
        };
        const token = 'generated_token';
      
        // Simular la consulta a la base de datos
        User.findOne = jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValueOnce(user),
        });
      
        service.createToken = jest.fn().mockReturnValueOnce(token);
      
        await expect(signIn(req)).rejects.toEqual({
          status: 500,
          message: 'Error al ingresar: Error: Test error',
        });
      
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(user.comparePassword).toHaveBeenCalledWith(req.body.password, expect.any(Function));
        expect(service.createToken).not.toHaveBeenCalled();
      });
      
      
      it('should reject with error 404 with the wrong password', async () => {
        const req = {
          body: {
            email: 'mariana@chef.com',
            password: 'wrong',
          },
        };
      
        const user = {
          _id: 'user_id',
          email: req.body.email,
          role: 'user',
          comparePassword: jest.fn(),
        };
        const token = 'generated_token';
      
        // Simular la consulta a la base de datos
        User.findOne = jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValueOnce(user),
        });
      
        user.comparePassword.mockImplementation((password, callback) => {
          callback(null, false);
        });
      
        service.createToken = jest.fn().mockReturnValueOnce(token);
      
        await expect(signIn(req)).rejects.toEqual({
          status: 400,
          message: 'Credenciales no válidas',
        });
      
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(user.comparePassword).toHaveBeenCalledWith(req.body.password, expect.any(Function));
        expect(service.createToken).not.toHaveBeenCalled();
      });
      
      it('should sign in with valid credentials', async () => {
        const req = {
          body: {
            email: 'mariana@chef.com',
            password: 'mariana',
          },
        };
      
        const user = {
          _id: 'user_id',
          email: req.body.email,
          role: 'user',
          comparePassword: jest.fn(), // Agregar función comparePassword simulada
        };
        const token = 'generated_token';
      
        // Simular la consulta a la base de datos
        User.findOne = jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValueOnce(user),
        });
      
        user.comparePassword.mockImplementation((password, callback) => {
          callback(null, true);
        });
      
        service.createToken = jest.fn().mockReturnValueOnce(token);
      
        const result = await signIn(req);
      
        expect(result.status).toEqual(200);
        expect(result.message).toEqual('Te has logueado correctamente');
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(user.comparePassword).toHaveBeenCalledWith(req.body.password, expect.any(Function));
        expect(service.createToken).toHaveBeenCalledWith(user);
      });
      
      it('should throw an error 500', async () => {
        const req = {
          body: {
            email: 'mariana@chef.com',
            password: 'mariana',
          },
        };
      
        const user = {
          _id: 'user_id',
          email: req.body.email,
          role: 'user',
        };
      
        // Simular la consulta a la base de datos
        User.findOne = jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          exec: jest.fn().mockRejectedValueOnce(new Error('Test error')),
        });
      
        await expect(signIn(req)).rejects.toEqual({
          status: 500,
          message: 'Error al ingresar: Error: Test error',
        });
      
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      });   
});
