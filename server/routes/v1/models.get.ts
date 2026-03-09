import { defineEventHandler, getHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { newApiUrl, newApiToken } = config
  
  // Optional: Check if the user is authenticated (using their own api key)
  // For /v1/models, it's often open or requires the user's key. We'll use the central token to get the actual available models.
  
  try {
    const response = await fetch(`${newApiUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${newApiToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: 'Upstream API Error' })
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error fetching models:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', cause: error })
  }
})