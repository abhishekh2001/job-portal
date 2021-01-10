const logger = require('./logger')

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
    }

    next(err)
}

module.exports = {
    unknownEndpoint,
    errorHandler
}
