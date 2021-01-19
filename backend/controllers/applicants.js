const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const Recruiter = require('../models/recruiter')
const Application = require('../models/application')
const Applicant = require('../models/applicant')
const User = require('../models/user')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const applicants = await Applicant
            .find()
            .populate({
                path: 'user',
                model: 'User'
            })
        res.json(applicants)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const applicant = await Applicant
            .findById(req.params.id)
            .populate({
                path: 'user',
                model: 'User'
            })
        if (!applicant) {
            next({name: 'DocumentNotFoundError', message: 'applicant not found'})
        } else {
            res.json(applicant)
        }
    } catch (err) {
        next(err)
    }
})

router.put('/:id', middleware.auth, async (req, res, next) => {
    const user = req.user
    const body = req.body

    try {
        const applicant = await Applicant
            .findOne({user: user.id})
        const appUser = await User
            .findById(user.id)
        if (!applicant)
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})

        if (body.email || body.name) {
            const updatedUser = {...appUser.toJSON()}
            if (body.name)
                updatedUser['name'] = body.name
            if (body.email)
                updatedUser['email'] = body.email
            const updated = await User.findByIdAndUpdate(user.id, updatedUser, {new: true})
            console.log('update', updated)
        }

        const updatedApplicant = {...applicant.toJSON(), ...body}
        console.log('updated', updatedApplicant)
        const savedApplicant = await Applicant
            .findByIdAndUpdate(applicant._id, updatedApplicant, {new:true})
            .populate({path: 'user', model: 'User'})
        res.json(savedApplicant)
    } catch (err) {
        next(err)
    }
})

router.get('/list/applications', middleware.auth, async (req, res, next) => {
    const user = req.user
    const body = req.body

    try {
        const applicant = await Applicant
            .findOne({user: user.id})
        if (!applicant)
            return next({name: 'DocumentNotFoundError', message: 'user does not exist'})

        const applications = await Application
            .find({applicant: applicant._id})
            .populate({
                path: 'job',
                model: 'Job',
                populate: {
                    path: 'recruiter',
                    model: 'Recruiter',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                }
            })
        res.json(applications)
    } catch (err) {
        next(err)
    }
})

module.exports = router