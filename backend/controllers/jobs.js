const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const router = express.Router()

router.get('/test', middleware.auth, async (req, res, next) => {
    try {
        const jobs = await Job.find({}).populate('recruiter')
        res.json(jobs)
    } catch (err) {
        next (err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.find({}).populate('recruiter')
        res.json(jobs)
    } catch (err) {
        next(err)
    }
})

router.post('/', middleware.auth, async (req, res, next) => {
    const body = req.body
    const user = req.user

    try {
        if (user.type !== 'recruiter') {
            return next({name: 'AuthorizationError', message: 'user is not a recruiter'})
        }
        const jobDetails = {...body, recruiter: user.id}
        const job = new Job(jobDetails)
        const savedJob = await job.save()

        res.json(savedJob)
    } catch (err) {
        next(err)
    }
})

module.exports = router
