import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { decodeBasicToken } from './services'
import * as model from './model'

export const login = async ctx => {
  try {
    const [email, password] = decodeBasicToken(
      ctx.request.headers.authorization
    )

    const user = await model.findUnique({
      where: { email, password },
    })

    if (!user) {
      ctx.status = 404
      return
    }

    /*const passwordEqual = await bcrypt.compare(password, user.password)

    if (!user || !passwordEqual) {
      ctx.status = 404
      return
    }*/

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user, token }
  } catch (error) {
    console.log(error)

    if (error.custom) {
      ctx.status = 400
      return
    }

    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
    return
  }
}

export const list = async ctx => {
  try {
    const users = await model.findMany()
    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
    return
  }
}

export const create = async ctx => {
  try {
    const saltRounds = 10

    const hashedPassword = await bcrypt.hash(
      ctx.request.body.password,
      saltRounds
    )

    const user = await model.create({
      data: {
        name: ctx.request.body.name,
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

export const update = async ctx => {
  const { name, email } = ctx.request.body

  try {
    const user = await model.update({
      where: { id: ctx.params.id },
      data: { name, email },
    })

    ctx.body = user
  } catch (err) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const remove = async ctx => {
  try {
    await model.remove({
      where: { id: ctx.params.id },
    })

    ctx.body = { id: ctx.params.id }
  } catch (err) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}
