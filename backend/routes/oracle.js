const oracleRouter = require('express').Router()

oracleRouter.post("/", (request, response) => {
    const message = request.body

    if (!message) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    console.log(message)
    response.status(201).json("lol")

})

module.exports = oracleRouter