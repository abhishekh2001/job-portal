const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')

const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    } else if (err.name === 'AuthenticationError') {
        return res.status(400).json({error: err.message})
    } else if (err.name === 'AuthorizationError') {
        return res.status(401).json({error: err.message})
    }

    next(err)
}

const auth = (req, res, next) => {
    const authorization = req.get('authorization')
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    if (!token) {
        return next({name: 'JsonWebTokenError'})
    }

    try {
        const decoded = jwt.verify(token, config.SECRET)
        req.user = decoded
    } catch (err) {
        console.log('err in auth middleware', err)
        next(err)
    }

    next()
}


module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}