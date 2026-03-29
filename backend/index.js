process.loadEnvFile()
const express = require('express')
const app = express()
oracleRouter = require('./routes/oracle')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/oracle', oracleRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
