import request from 'supertest'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

import { app } from './server-setup'

const server = app.listen()

describe('User routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })

  it('should return not found with wrong password', async () => {
    // prepare
    const email = 'luanmelolima@gmail.com'
    const password = 'teste'

    //execution
    const result = await request(server).get('/login').auth(email, password)

    //expectation
    expect(result.status).toBe(404)
  })

  it('should return not found with wrong email', async () => {
    // prepare
    const email = 'errado@gmail.com'
    const password = '123456'

    //execution
    const result = await request(server).get('/login').auth(email, password)

    //expectation
    expect(result.status).toBe(404)
  })

  it('should return logged in user by correct credentials', async () => {
    // prepare
    const email = 'luanmelolima2@gmail.com'
    const password = '123456'

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await prisma.user.create({
      data: { email, password: hashedPassword },
    })

    //execution
    const result = await request(server).get('/login').auth(email, password)

    //expectation
    expect(result.status).toBe(200)
    expect(result.body.user).toBeTruthy()
    expect(result.body.user.id).toBeTruthy()
    expect(result.body.user.email).toBe(email)
    //expect(result.body.user.password).toBeFalsy()
  })
})
