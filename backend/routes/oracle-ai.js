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
    response.setHeader('Content-Type', 'text/plain',"charset=utf-8");
    response.setHeader('transfer-encoding','chunked')

    if (!message) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    try {
        
        response.write("Te amo mucho, Selene")
        return response.end()

    } catch (error) {
        if (!response.headersSent) {
            res.setHeader('Content-Type', 'application/json')
            return response.status(500).json({error: 'error connecting to AI'})
    }
    return response.end()
    }    

})

module.exports = oracleRouter