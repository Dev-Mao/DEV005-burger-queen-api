const { isAuth, isAdmin } = require('../../middlewares/auth')
const service = require('../../services/index')

jest.mock('../../services/index');


describe('isAuth', () => {
    it('should return error 403 if authorization header is missing', async () => {
        const req = {
          headers: {}
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
        
        const next = jest.fn();
    
        await isAuth(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'No tienes autorización' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return error with the appropriate status if token decoding fails', async () => {
        const req = {
          headers: {
            authorization: 'Bearer invalid_token'
          }
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
    
        const next = jest.fn();
    
        // Mock de la función decodeToken
        const mockError = {
          status: 500
        };
        service.decodeToken = jest.fn().mockRejectedValue(mockError);
        try{
            await isAuth(req, res, next);
        }catch{
            expect(service.decodeToken).toHaveBeenCalledWith('invalid_token');
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).not.toHaveBeenCalled();
        }    
    });
})

describe('isAdmin', () => {
    it('should call next if the user is admin', async () => {
        const req = {
            role: 'admin'
          };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
      
        const next = jest.fn();

        await isAdmin(req, res, next)

        expect(next).toHaveBeenCalled();
    })

    it('should call error if the user is not admin', async () => {
        const req = {
            role: 'noadmin'
          };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
      
        const next = jest.fn();

        await isAdmin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    })

})