import { nanoid } from 'nanoid'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username } = body

  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Username is required' })
  }

  let user = await prisma.user.findUnique({
    where: { username }
  })

  let isNew = false

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        balance: 100 // 初始额度
      }
    })
    isNew = true
  }

  // Ensure user has exactly one API key
  let apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id }
  })

  if (apiKeys.length === 0) {
    const newKey = `sk-${nanoid(32)}`
    await prisma.apiKey.create({
      data: {
        key: newKey,
        userId: user.id
      }
    })
  } else if (apiKeys.length > 1) {
    // Optional: if they have more than one, we could delete the extras, but let's just keep the first one as default
  }

  // Use the user's ID as a simple JWT/Session token for this demo
  const token = user.id

  return {
    user,
    token,
    isNew
  }
})