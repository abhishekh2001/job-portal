const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const authRouter = require('./controllers/auth')

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => console.log('Connected to mongodb'))

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
