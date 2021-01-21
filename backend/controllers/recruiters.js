const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const Recruiter = require('../models/recruiter')
const Application = require('../models/application')
const User = require('../models/user')
const Applicant = require('../models/applicant')
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
            .find({recruiter: recruiter._id})
        console.log(jobs)
        const returnData = []
        for (let ind in jobs) {
            const job = jobs[ind].toJSON()
            const currApplicants = await Application.countDocuments({job: job._id})
            const currPositions = await Application.countDocuments({job: job._id, status: 'accepted'})
            console.log(job)
            returnData.push({...job, currApplicants, currPositions})
        }
        res.json(returnData)
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

router.put('/rate/:appId', middleware.auth, async (req, res, next) => {
    const appId = req.params.appId
    const user = req.user
    const body = req.body

    if (user.type !== 'recruiter')
        return next({name: 'AuthorizationError', message: 'user is not authorized to rate this applicant'})

    try {
        const recruiter = await Recruiter.findOne({user: user.id})
        const applicant = await Applicant.findById(appId)
        if (!recruiter)
            return next({
                name: 'BadRequestError',
                message: 'recruiter does not exist'
            })
        if (!applicant)
            return next({
                name: 'BadRequestError',
                message: 'applicant does not exist'
            })
        console.log('ratings', applicant.ratings, recruiter)
        if (applicant.ratings.map(a => a.recruiter.toString()).indexOf(recruiter._id.toString()) >= 0)
            return next ({
                name: 'BadRequestError',
                message: 'recruiter has already rated this applicant'
            })

        applicant.ratings.push({recruiter: recruiter._id, value: body.value})
        const saved = await applicant.save()
        console.log('saved as', saved)
        res.json(saved)
    } catch (err) {
        next(err)
    }
})

router.get('/list/acceptedApplications', middleware.auth, async (req, res, next) => {
    const user = req.user
    if (!user || user.type !== 'recruiter')
        return next({
            name: 'AuthorizationError',
            message: 'user does not exist or is not authorized'
        })

    try {
        const recruiter = await Recruiter.findOne({user: user.id})
        if (!recruiter)
            return next({
                name: 'AuthorizationError',
                message: 'user is not authorized'
            })
        const accepted = await Application
            .find({status: 'accepted'})
            .populate({
                path: 'job',
                model: 'Job'
            })
            .populate({
                path: 'applicant',
                model: 'Applicant',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        const resp = []
        for (let ind in accepted) {
            if (accepted[ind].job.recruiter.toString() === recruiter._id.toString())
                resp.push(accepted[ind])
        }
        console.log('resulting array len: ', resp.length)  // TODO: test
        res.json(resp)
    } catch (err) {
        next(err)
    }
})

module.exports = router
