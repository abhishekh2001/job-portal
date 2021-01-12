const express = require('express')
const Job = require('../models/job')
const Applicant = require('../models/applicant')
const Application = require('../models/application')
const Recruiter = require('../models/recruiter')
const middleware = require('../utils/middleware')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const applications = await Application
            .find({})
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
        res.json(applications)
    } catch (err) {
        next(err)
    }
})

// Applicant must be authorized
// Only applicant can create new application
router.post('/:jobId', middleware.auth, async (req, res, next) => {
    const jobId = req.params.jobId
    const user = req.user
    const body = req.body

    if (user.type !== 'applicant')
        return next({name: 'AuthorizationError', message: 'user is not authorized to apply for this job'})

    try {
        const job = await Job.findById(jobId)
        const applicant = await Applicant.findOne({user: user.id})

        if (!job)
            return next({name: 'BadRequestError', message: 'job is not available'})
        if (!applicant)
            return next({name: 'AuthorizationError', message: 'user is not authorized to apply for this job'})

        if (job.applicationStatus === 'full')
            return next({
                name: 'BadRequestError',
                message: 'maximum applications limit for job has been reached'
            })
        if (job.positionStatus === 'full')
            return next({
                name: 'BadRequestError',
                message: 'maximum positions limit for this job has been reached'
            })

        // TODO: check if user has 10 active applications
        const numUserApplications = await Application
            .countDocuments({applicant: applicant._id, status: 'applied'})
        if (numUserApplications >= 10)
            return next({
                name: 'BadRequestError',
                message: 'user has 10 open applications'
            })

        const prevApplied = await Application.findOne({applicant: applicant._id, job: job._id})
        if (prevApplied)
            return next({name: 'BadRequestError', message: 'user has already applied to this job'})
        else {
            const application = new Application({
                sop: body.sop,
                job: job._id,
                applicant: applicant._id
            })

            const savedApplication = await application.save()

            const numApplications = await Application.countDocuments({job: job._id})
            if (numApplications >= job.maxApplications) {
                job.applicationStatus = 'full'
                await job.save()
            }
            res.status(201).json(savedApplication)
        }
    } catch (err) {
        return next(err)
    }
})

module.exports = router
