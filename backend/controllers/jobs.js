const express = require('express')
const Job = require('../models/job')
const middleware = require('../utils/middleware')
const Recruiter = require('../models/recruiter')
const Application = require('../models/application')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job
            .find({})
            .populate({
                path: 'recruiter',
                model: 'Recruiter',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        console.log(jobs)
        res.json(jobs)
    } catch (err) {
        next(err)
    }
})

// post must be performed by recruiter
router.post('/', middleware.auth, async (req, res, next) => {
    const body = req.body
    const user = req.user

    try {
        const recruiter = await Recruiter.findOne({user: user.id})
        if (user.type !== 'recruiter' || !recruiter)
            return next({name: 'AuthorizationError', message: 'user is not a recruiter'})

        const jobDetails = {...body, recruiter: recruiter._id}
        const job = new Job(jobDetails)
        const savedJob = await job.save()

        res.json(savedJob)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', middleware.auth, async (req, res, next) => {
    const body = req.body
    const id = req.params.id
    const user = req.user

    try {
        const job = await Job.findById(id)
        const recruiter = await Recruiter.findOne({user: user.id})
        if (!job)
            return next({name: 'DocumentNotFoundError', message: 'job not found'})
        if (!recruiter)
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})
        if (job.recruiter.toString() !== recruiter._id.toString())
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})

        const uJob = job.toJSON()
        const notAllowed = ['id', '_id', 'recruiter']
        for (let field in body) {
            if (!notAllowed.includes(field)) {
                if (field === 'maxApplications') {
                    const applicationsCount = await Application
                        .countDocuments({job: job._id})
                    uJob['applicationStatus'] = applicationsCount >= body[field] ? 'full' : 'free'
                }
                if (field === 'maxPositions') {
                    const positionsCount = await Application
                        .countDocuments({job: job._id, status: 'accepted'})
                    uJob['positionStatus'] = positionsCount >= body[field] ? 'full' : 'free'
                }
                uJob[field] = body[field]
            }
        }

        const savedJob = await Job.findByIdAndUpdate(req.params.id, uJob, {new: true})

        if (!savedJob) {
            next({name: 'DocumentNotFoundError', message: 'error updating document'})
        } else {
            res.status(200).json(savedJob)
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job
            .findById(req.params.id)
            .populate({
            path: 'recruiter',
            model: 'Recruiter',
            populate: {
                path: 'user',
                model: 'User'
            }
        })

        if (job) {
            const currApplicants = await Application.countDocuments({job: job._id})
            const currPositions = await Application.countDocuments({job: job._id, status: 'accepted'})

            res.json({...job.toJSON(), currPositions, currApplicants})
        } else {
            res.status(404).json({error: 'job not found'})
        }
    } catch (err) {
        next(err)
    }
})

router.get('/applications/:jobId', async (req, res, next) => {
    const jobId = req.params.jobId

    try {
        const job = await Job.findById(jobId)
        if (!job)
            return next({name: 'DocumentNotFoundError', message: 'job not found'})

        const applications = await Application.find({job: jobId})
        res.json(applications)
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', middleware.auth, async (req, res, next) => {
    const id = req.params.id
    const user = req.user

    try {
        const job = await Job.findById(id)
        const recruiter = await Recruiter.findOne({user: user.id})

        if (!job) {
            return res.status(204).end()
        }
        if (!recruiter || job.recruiter.toString() !== recruiter._id.toString()) {
            return next({name: 'AuthorizationError', message: 'user does not have permissions'})
        }
        const deletedJob = await Job.findByIdAndDelete(id)
        const removedApps = await Application.deleteMany({job: deletedJob._id})
        console.log('deleted, removed', deletedJob, removedApps)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = router
