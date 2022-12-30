import { decodeBasicToken } from './services'

describe('User services', () => {
  it('should return credentials by basic authentication token', () => {
    // prepare
    const email = 'luanmelolima@gmail.com'
    const password = '123456'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    // executation
    const result = decodeBasicToken(basicToken)

    // expectation
    expect(result).toEqual([email, password])
  })

  it('should throw new error when token is not Basic type', () => {
    // prepare
    const email = 'luanmelolima@gmail.com'
    const password = '123456'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Bearer ${token}`

    // executation
    const result = () => decodeBasicToken(basicToken)

    // expectation
    expect(result).toThrowError('Wrong token type')
  })

  it('should throw new error when credentials is not on correct format', () => {
    // prepare
    const email = 'luanmelolima@gmail.com'
    const password = '123456'
    const token = Buffer.from(`${email}${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    // executation
    const result = () => decodeBasicToken(basicToken)

    // expectation
    expect(result).toThrowError('Wrong credentials format')
  })

  it('should throw new error when credentials is not base64 encoded', () => {
    // prepare
    const email = 'luanmelolima@gmail.com'
    const password = '123456'
    const token = `${email}:${password}`

    const basicToken = `Basic ${token}`

    // executation
    const result = () => decodeBasicToken(basicToken)

    // expectation
    expect(result).toThrowError('Wrong credentials is not correct encoded')
  })
})
