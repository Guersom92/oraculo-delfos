const oracleRouter = require('express').Router()
const rateLimit = require('express-rate-limit')

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // -> 1 minuto
  limit: 3, // -> 3 peticiones por IP por minuto
  message: { error: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde.' },
  legacyHeaders: false,
  standardHeaders: 'draft-8' // devuelve headers estándard RateLimit-*
})

oracleRouter.use(aiRateLimiter)

oracleRouter.post("/", async(request, response) => {
    const message = request.body

    if (!message) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    try {
        
        console.log(message)
        return response.status(201).json("Te amo mucho, Selene <3")

    } catch (error) {
        return response.status(500).json({error: 'error connecting to AI'})
    }    
})

module.exports = oracleRouter