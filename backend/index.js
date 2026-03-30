//process.loadEnvFile()
const express = require('express')
const app = express()
oracleRouter = require('./routes/oracle-ai')
const cors = require('cors')
require('dotenv').config(); 

app.set('trust proxy', 1)
const corsOptions = {
  exposedHeaders: ['Retry-After']
};
app.use(cors(corsOptions))
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/oracle', oracleRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
