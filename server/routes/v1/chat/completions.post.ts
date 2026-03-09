import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: token },
    include: { user: true }
  })

  if (!apiKey) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid API Key' })
  }

  if (apiKey.user.balance <= 0) {
    throw createError({ statusCode: 402, statusMessage: 'Payment Required: Insufficient balance' })
  }

  const body = await readBody(event)
  const config = useRuntimeConfig()

  // 粗略计算 Prompt Token (每2个字符算1个Token)
  let promptText = ''
  if (body.messages) {
    for (const msg of body.messages) {
      promptText += msg.content || ''
    }
  }
  const promptTokens = Math.ceil(promptText.length / 2)

  // Request to Upstream
  // Ensure we ask for stream options to get usage if streaming
  if (body.stream) {
    body.stream_options = { include_usage: true }
  }

  const upstreamResponse = await fetch(`${config.newApiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.newApiToken}`,
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify(body)
  })

  if (!upstreamResponse.ok) {
    const errText = await upstreamResponse.text()
    console.error(`Upstream error: ${upstreamResponse.status} ${upstreamResponse.statusText}`, errText)
    throw createError({ statusCode: upstreamResponse.status, statusMessage: errText || upstreamResponse.statusText })
  }

  if (!body.stream) {
    const data = await upstreamResponse.json()
    // 计费计算
    const usage = data.usage || { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 }
    const cost = (usage.total_tokens || 0) * 0.0001 // 每token花费 0.0001 GNK

    await prisma.user.update({
      where: { id: apiKey.userId },
      data: { balance: { decrement: cost } }
    })

    await prisma.transaction.create({
      data: {
        userId: apiKey.userId,
        type: 'consume',
        amount: -cost,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        model: body.model || 'unknown'
      }
    })

    return data
  }

  // Streaming response
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const reader = upstreamResponse.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let streamText = ''
  let buffer = ''
  let completionTokens = 0
  let promptTokensFromStream = promptTokens

  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close()
        return
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          controller.enqueue(value)
          
          buffer += chunk
          let boundary = buffer.indexOf('\n')
          
          while (boundary !== -1) {
            const line = buffer.slice(0, boundary).trim()
            buffer = buffer.slice(boundary + 1)
            boundary = buffer.indexOf('\n')
            
            if (!line) continue
            
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const jsonStr = line.slice(6).trim()
                if (!jsonStr || jsonStr === '[DONE]') continue
                
                const parsed = JSON.parse(jsonStr)
                if (parsed.usage) {
                  promptTokensFromStream = parsed.usage.prompt_tokens
                  completionTokens = parsed.usage.completion_tokens
                } else if (parsed.choices && parsed.choices.length > 0) {
                  const content = parsed.choices[0]?.delta?.content
                  if (content !== undefined && content !== null) {
                    streamText += content
                  }
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
                // console.error("Parse error:", e, line)
              }
            }
          }
        }
      } finally {
        if (completionTokens === 0) {
          // 如果没有 usage 返回，粗略计算
          completionTokens = Math.ceil(streamText.length / 2)
        }
        
        const totalTokens = promptTokensFromStream + completionTokens
        const cost = totalTokens * 0.0001

        if (cost > 0) {
          await prisma.user.update({
            where: { id: apiKey.userId },
            data: { balance: { decrement: cost } }
          }).catch(console.error)

          await prisma.transaction.create({
            data: {
              userId: apiKey.userId,
              type: 'consume',
              amount: -cost,
              promptTokens: promptTokensFromStream,
              completionTokens: completionTokens,
              model: body.model || 'unknown'
            }
          }).catch(console.error)
        }

        controller.close()
      }
    }
  })
})