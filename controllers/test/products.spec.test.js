const Product = require('../../models/product');
const { getProduct, getProducts, saveProduct, updateProduct, deleteProduct } = require('../../controllers/products'); 



describe('getProduct', () => {
    const req = { params: { productId: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    it('should return a product with the correct id', async () => {
        const mockProduct = {
          _id: '123',
          name: 'Product A'
        };
        
        // Mock de la función `Product.findById`
        Product.findById = jest.fn().mockResolvedValue(mockProduct);
      
        // Llamar a la función getProduct con una solicitud y una respuesta simuladas
        await getProduct(req, res);
      
        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Verificar que Product.findById sea llamado con el id correcto
        expect(Product.findById).toHaveBeenCalledWith('123');
        // Verificar que res.send sea llamado con el producto correcto
        expect(res.send).toHaveBeenCalledWith({ product: mockProduct });
      });  
    
      it('should return error 404 if the product does not exist', async () => {
        // Mock de la función `Product.findById` que devuelve null
        Product.findById = jest.fn().mockResolvedValueOnce(null);
      
        // Llamar a la función getProduct con una solicitud y una respuesta simuladas       
        await getProduct(req, res);
      
        // Verificar que la respuesta tenga un código de estado 404
        expect(res.status).toHaveBeenCalledWith(404);
      });
      
      it('should return error 500', async () => {
        const error = new Error('Error de prueba');
        // Agregar un mock para Product.findById que devuelve un error
        Product.findById = jest.fn().mockRejectedValue(error);
        
        // Llamar a la función getProduct con una solicitud y una respuesta simuladas
        const req = { params: { productId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      
        try {
          await getProduct(req, res);
        } catch {
          // Verificar que Product.findById sea llamado con el id correcto
          expect(Product.findById).toHaveBeenCalledWith('123');
          // Verificar que la respuesta tenga un código de estado 500
          expect(res.status).toHaveBeenCalledWith(500);
          // Verificar que la respuesta tenga un mensaje de error
          expect(res.send).toHaveBeenCalledWith({ message: `Error al realizar la petición: ${error}` });
        }
      });
})

describe('getProducts', () => {
    it('should return status 200 and the list of products', async () => {
        const mockProduct = {
            _id: '123',
            name: 'burger'
        };
        // Agregar un mock para Product.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Product.find= jest.fn().mockResolvedValueOnce(mockProduct);
        // Llamar a la función getProducts con una solicitud y una respuesta simuladas
        const req = { params: { } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getProducts(req, res);
    
        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toBeCalledWith(200);
        // Verificar que product.find sea llamado
        expect(Product.find).toHaveBeenCalled();
        // Verificar que la respuesta tenga la orden
        expect(res.send).toBeCalledWith({ products: mockProduct });
    });

    it('should return error 404  if there is no products', async () => {
        // Agregar un mock para Product.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Product.find = jest.fn().mockResolvedValueOnce(null);
        // Llamar a la función getProducts con una solicitud y una respuesta simuladas
        const req = { };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await getProducts(req, res);
        // Verificar que la respuesta tenga un código de estado 404
        expect(res.status).toBeCalledWith(404);
    });

    it('should return error 500  if there is an error', async () => {
        const error = new Error('Error de prueba');
        // Agregar un mock para Product.findById que devuelve una promesa resuelta con el objeto de pedido simulado
        Product.find = jest.fn().mockRejectedValue(error);
        // Llamar a la función getProducts con una solicitud y una respuesta simuladas
        const req = { };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        try {
            await getProducts(req, res);
        } catch {
            // Verificar que la respuesta tenga un código de estado 404
            expect(res.status).toBeCalledWith(500);
        }
    });
});

describe('saveProduct', () => {
    const req = {
      body: {
        name: 'burger',
        price: '1000',
        image: 'burger.png',
        type: 'lunch'
      }
    };

    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    it('should save the product with valid information', async () => {
    
        const mockSavedProduct = {
          _id: 'productId',
          name: 'burger',
          price: '1000',
          image: 'burger.png',
          type: 'lunch'
        };
        Product.prototype.save = jest.fn().mockResolvedValue(mockSavedProduct);
    
        await saveProduct(req, res);
        // Verificar que la respuesta tenga un código de estado 200
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should send an error 500 if there is an error', async () => {
    
        const error =  new Error('Error de prueba');

        Product.prototype.save = jest.fn().mockRejectedValue(error);
        
        try {
            await saveProduct(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
      });
})

describe('updateProduct', () => {
    const req = {
        params: {
          productId: '12345'
        }
      };
    
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

    it('should send a status 200 if update a product', async () => {
        Product.findByIdAndUpdate = jest.fn().mockResolvedValue();
        await updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    })

    it('should send a status 500 if there is an error updating the product', async () => {
        const error =  new Error('Error de prueba');
        Product.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
        try {
            await updateProduct(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
    })
})

describe('deleteProduct', () => {
    const req = {
        params: {
          productId: '12345'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
 
    it('should send a status 200 when the order has been deleted', async () => {

        Product.deleteOne = jest.fn().mockResolvedValue();
        // Llamar a la función
        await deleteProduct(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    })

    it('should send a status 500 when there is a error deleting the product', async () => {

        Product.deleteOne = jest.fn().mockRejectedValue();
        // Llamar a la función
        try {
            await deleteProduct(req, res);
        }catch{
            // Verificar que la respuesta tenga un código de estado 500
            expect(res.status).toHaveBeenCalledWith(500);
        }
    })
})