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

        const prevApplied = await Application.findOne({applicant: applicant._id})
        console.log('prev', prevApplied)
        if (prevApplied)
            return next({name: 'BadRequestError', message: 'user has already applied to this job'})
        else {
            const application = new Application({
                sop: body.sop,
                job: job._id,
                applicant: applicant._id
            })

            const savedApplication = await application.save()
            res.status(201).json(savedApplication)
        }
    } catch (err) {
        return next(err)
    }
})

module.exports = router
