import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1] // Simple demo uses user ID as token
  const userId = token

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId }
  })

  return {
    user,
    apiKeys
  }
})