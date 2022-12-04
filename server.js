const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')
const { json } = require('express')

//config
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use('/public', express.static('public'))
app.use('/', json('it works'))
app.use(errorMiddleware)

const uri = process.env.ATLAS_URI

const start = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(port, () => console.log(`Port  ${port}`))
    } catch (e) {
        console.log(e)
    }
}

start()