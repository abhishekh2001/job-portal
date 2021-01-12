const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const authRouter = require('./controllers/auth')
const usersRouter = require('./controllers/users')
const jobsRouter = require('./controllers/jobs')
const applicationsRouter = require('./controllers/applications')
const recruitersRouter = require('./controllers/recruiters')

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => console.log('Connected to mongodb'))

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/apply', applicationsRouter)
app.use('/api/recruiters', recruitersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
