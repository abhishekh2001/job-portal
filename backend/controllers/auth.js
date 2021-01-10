const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const router = express.Router()

router.get('/login', async (req, res, next) => {
    res.send('login')
})

// POST to api/auth; login
router.post('/', async (req, res, next) => {
    const body = req.body

    if (!body.password || !body.email) {
        return next({
            name: 'ValidationError',
            message: 'password or email cannot be empty'
        })
    }
    try {
        const user = await User.findOne({email: body.email})

        if (!user) {
            return next({name: 'AuthenticationError', message: 'user does not exist'})
        }

        const passOk = await bcrypt.compare(body.password, user.passwordHash)

        if (!passOk) {
            return next({name: 'AuthenticationError', message: 'invalid credentials'})
        }

        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            type: user.type
        }

        const token = jwt.sign(payload, config.SECRET)

        res.json({
            token: token,
            email: user.email,
            name: user.name
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

module.exports = router
