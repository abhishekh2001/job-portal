const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const router = express.Router()

// POST to api/auth; login
router.post('/login', async (req, res, next) => {
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
            id: user._id, email: user.email, type: user.type
        }
        const token = jwt.sign(payload, config.SECRET)

        res.json({
            token: token,
            email: user.email,
            name: user.name
        })
    } catch (err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
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
        const user = new User({...body, passwordHash: passwordHash})

        const savedUser = await user.save()

        let responseData = {account: savedUser}
        if (savedUser.type === 'applicant') {
            const applicant = new Applicant({...body, user: savedUser._id})
            const savedApplicant = await applicant.save()
            responseData = {...responseData, accountDetails: savedApplicant}
        } else {
            const recruiter = new Recruiter({...body, user: savedUser._id})
            const savedRecruiter = await recruiter.save()
            responseData = {...responseData, accountDetails: savedRecruiter}
        }

        res.status(201).json(responseData)
    } catch (err) {
        next(err)
    }
})

module.exports = router
