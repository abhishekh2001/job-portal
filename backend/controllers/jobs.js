const express = require('express')
const Job = require('../models/job')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.find({}).populate('recruiter')
        res.json(jobs)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    const body = req.body
    const user = body.user

    try {
        if (user.type !== 'recruiter') {
            return next({name: 'AuthorizationError', message: 'user is not a recruiter'})
        }
        const jobDetails = {...body, recruiter: user._id}
        const job = new Job(jobDetails)
        const savedJob = await job.save()

        res.json(savedJob)
    } catch (err) {
        next(err)
    }
})

module.exports = router
