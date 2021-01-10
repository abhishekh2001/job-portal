const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const usersRouter = express.Router()

usersRouter.get('/login', async (req, res, next) => {
    res.send('login')
})

usersRouter.post('/', async (req, res, next) => {
    const body = req.body
    const saltRounds = 10

    if (!body.password) {
        return next({
            name: 'ValidationError',
            message: 'password cannot be empty'
        })
    }
    try {
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const user = new User({
            email: body.email,
            name: body.name,
            type: body.type,
            passwordHash: passwordHash
        })

        const savedUser = await user.save()

        const payload = {
            id: savedUser._id,
            email: savedUser.email,
            type: savedUser.type
        }

        const token = jwt.sign(payload, config.SECRET)

        res.json({
            token: token,
            email: savedUser.email,
            name: savedUser.name
        })
    } catch (err) {
        next(err)
    }
})

module.exports = usersRouter