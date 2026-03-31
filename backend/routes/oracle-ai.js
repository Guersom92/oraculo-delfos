const oracleRouter = require('express').Router()
const rateLimit = require('express-rate-limit')
const  streamOracleResponse  = require('../services/oracle-service')

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 0,            // 3 peticiones por IP por minuto
  message: { error: 'Demasiadas consultas al oráculo. Los astros necesitan descanso.' },
  legacyHeaders: false,
  standardHeaders: 'draft-8'
})

oracleRouter.use(aiRateLimiter)

oracleRouter.post('/', async (request, response) => {
  const question = request.body?.question

  if (!question) {
    return response.status(400).json({ error: 'El oráculo no responde al silencio. Envía una pregunta.' })
  }

  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Transfer-Encoding', 'chunked')

  try {
    await streamOracleResponse(question, response)
    return response.end()
  } catch (error) {
    console.error('[oracle]', error.message)
    if (!response.headersSent) {
      response.setHeader('Content-Type', 'application/json')
      return response.status(500).json({ error: 'El oráculo guarda silencio. Intenta de nuevo.' })
    }
    return response.end()
  }
})

module.exports = oracleRouter