const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.find({}).populate('Recruiter')
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

router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('Recruiter')
        if (job) {
            res.json(job)
        } else {
            res.status(404).json({error: 'job not found'})
        }
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', middleware.auth, async (req, res, next) => {
    const id = req.params.id
    const user = req.user

    try {
        const job = await Job.findById(id)
        if (job.recruiter.toString() !== user.id.toString()) {
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})
        }
        const removedJob = await Job.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = router
