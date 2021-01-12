const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const Recruiter = require('../models/recruiter')
const Application = require('../models/application')
const User = require('../models/user')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const recruiters = await Recruiter
            .find({})
            .populate({
                path: 'user',
                model: 'User'
            })
        res.json(recruiters)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const recruiter = await Recruiter
            .findById(req.params.id)
            .populate({
                path: 'user',
                model: 'User'
            })
        res.json(recruiter)
    } catch (err) {
        console.log('here')
        next(err)
    }
})

router.get('/list/jobs', middleware.auth, async (req, res, next) => {
    const user = req.user

    if (user.type !== 'recruiter')
        return next({name: 'AuthorizationError', message: 'user must be a recruiter to access this route'})

    try {
        const recruiter = await Recruiter.findOne({user: user.id})
        const jobs = await Job
            .find({recruiter: recruiter.id})
        res.json(jobs)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', middleware.auth, async (req, res, next) => {
    const user = req.user
    const body = req.body

    try {
        const recruiter = await Recruiter
            .findOne({user: user.id})
        const recUser = await User
            .findById(user.id)
        if (!recruiter)
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})

        if (body.email || body.name) {
            const updatedUser = {...recUser.toJSON()}
            if (body.name)
                updatedUser['name'] = body.name
            if (body.email)
                updatedUser['email'] = body.email
            const updated = await User.findByIdAndUpdate(user.id, updatedUser, {new: true})
            console.log('update', updated)
        }

        const updatedRecruiter = {...recruiter.toJSON(), ...body}
        console.log('updated', updatedRecruiter)
        const savedRecruiter = await Recruiter
            .findByIdAndUpdate(recruiter._id, updatedRecruiter, {new:true})
            .populate({path: 'user', model: 'User'})
        res.json(savedRecruiter)
    } catch (err) {
        next(err)
    }
})

module.exports = router
