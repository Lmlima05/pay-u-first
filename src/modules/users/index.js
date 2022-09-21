import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

export const login = async ctx => {
  try {
    const { email, password } = ctx.request.body

    const [user] = await prisma.user.findMany({
      where: { email, password },
    })

    if (!user) {
      ctx.status = 404
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user, token }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu erradom tente novamente.'
    return
  }
}

export const list = async (ctx) => {
  try {
    const users = await prisma.user.findMany()
    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu erradom tente novamente.'
  }
}

export const create = async (ctx) => {
  try {
    const saltRounds = 10

    const hashedPassword = await bcrypt.hash(
      ctx.request.body.password,
      saltRounds
    )

    const user = await prisma.user.create({
      data: {
        data: ctx.request.body.name,
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    })

    ctx.body = user
  } catch (err) {
    console.log(err)
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const update = async (ctx) => {
  const { name, email } = ctx.request.body

  try {
    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data: { name, email },
    })

    ctx.body = user
  } catch (err) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const remove = async (ctx) => {
  try {
    await prisma.user.delete({
      where: { id: ctx.params.id },
    })

    ctx.body = { id: ctx.params.id }
  } catch (err) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}
