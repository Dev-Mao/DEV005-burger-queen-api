const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../../config');
const { decodeToken } = require('../index');

jest.mock('jwt-simple') // Mockear el módulo jwt-simple

describe('decodeToken', () => {
  it('should decode a valid token', async () => {
    const mockedPayload = {
      sub: 'user_id',
      role: 'admin',
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    }

    // Mockear la función 'decode' de jwt-simple
    jwt.decode = jest.fn(() => mockedPayload)

    const token = 'mocked_token'

    const decoded = await decodeToken(token)

    expect(jwt.decode).toHaveBeenCalledWith(token, config.SECRET_TOKEN)
    expect(decoded).toEqual(mockedPayload)
  })

  it('should reject an expired token', async () => {
    const expiredPayload = {
      sub: 'user_id',
      role: 'admin',
      iat: moment().subtract(14, 'days').unix(),
      exp: moment().subtract(1, 'day').unix()
    }

    // Mockear la función 'decode' de jwt-simple
    jwt.decode = jest.fn(() => expiredPayload)

    const token = 'mocked_expired_token'

    try {
      await decodeToken(token)
    } catch (error) {
      expect(error.status).toBe(401)
      expect(error.message).toBe('El token ha expirado')
    }

    expect(jwt.decode).toHaveBeenCalledWith(token, config.SECRET_TOKEN)
  })

  it('should reject an invalid token', async () => {
    // Mockear la función 'decode' de jwt-simple para lanzar un error
    jwt.decode = jest.fn(() => {
      throw new Error('Invalid Token')
    })

    const token = 'mocked_invalid_token'

    try {
      await decodeToken(token)
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.message).toBe('Invalid Token')
    }

    expect(jwt.decode).toHaveBeenCalledWith(token, config.SECRET_TOKEN)
  })
})