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

router.put('/rate/:appId', middleware.auth, async (req, res, next) => {
    const appId = req.params.appId
    const user = req.user
    const body = req.body

    if (user.type !== 'applicant')
        return next({name: 'AuthorizationError', message: 'user is not authorized to rate this job'})

    try {
        const application = await Application.findById(appId)
        if (!application)
            return next({name: 'BadRequestError', message: 'job is not available'})
        if (application.status !== 'accepted')
            return next({name: 'BadRequestError', message: 'Application not yet accepted'})
        const job = await Job.findById(application.job)
        const applicant = await Applicant.findOne({user: user.id})

        if (!job)
            return next({name: 'BadRequestError', message: 'job is not available'})
        if (!applicant)
            return next({name: 'AuthorizationError', message: 'user cannot rate this job'})
        if (applicant._id.toString() !== application.applicant.toString())
            return next({name: 'AuthorizationError', message: 'user is not authorized to apply for this job'})
        if (job.ratings.map(r => r.applicant.toString()).indexOf(applicant._id.toString()) >= 0)
            return next({name: 'BadRequestError', message: 'user has already rated'})

        job.ratings.push({applicant: applicant._id, value: body.value})
        const saved = await job.save()
        console.log('saved as', saved)
        res.json(saved)
    } catch (err) {
        return next(err)
    }
})

// Applicant must be authorized
// Only applicant can create new application
router.post('/applicant/:jobId', middleware.auth, async (req, res, next) => {
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

        const numUserApplications = await Application
            .countDocuments({applicant: applicant._id, $or: [{status: 'applied'}, {status: 'shortlisted'}]})
        console.log('numUserApplication', numUserApplications)
        if (numUserApplications >= 10)
            return next({
                name: 'BadRequestError',
                message: 'user has 10 open applications'
            })

        const accepted = await Application
            .countDocuments({applicant: applicant._id, status: 'accepted'})
        if (accepted)
            return next({
                name: 'BadRequestError',
                message: 'User has already been accepted for another job'
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

router.put('/recruiter/:appId', middleware.auth, async (req, res, next) => {
    const appId = req.params.appId
    const user = req.user
    const body = req.body

    if (user.type !== 'recruiter')
        return next({name: 'AuthorizationError', message: 'user is not authorized to apply for this job'})

    try {
        const application = await Application.findById(appId).populate({path: 'job', model: 'Job'})
        const recruiter = await Recruiter.findOne({user: user.id})

        if (!application || !recruiter) {
            return next({name: 'BadRequestError', message: 'application or recruiter not found'})
        }

        const pc = await Application.countDocuments({job: application.job._id, status: 'accepted'})
        console.log('here', pc, application.job.maxPositions)


        if (!application)
            return next({name: 'BadRequestError', message: 'application is not available'})
        if (!recruiter)
            return next({name: 'AuthorizationError', message: 'user is not authorized to perform this operation'})

        if (application.job.recruiter._id.toString() !== recruiter._id.toString())
            return next({
                name: 'AuthorizationError',
                message: 'user is not authorized to perform this operation (did not create job)'
            })
        if (application.job.positionStatus === 'full')
            return next({name: 'BadRequestError', message: 'maximum positions limit has been met for this job'})

        if (!body.status)
            return next({name: 'BadRequestError', message: 'status field is required'})

        const uApp = application.toJSON()
        if (body.status === 'accepted') {
            if (application.status !== 'shortlisted')
                return next({name: 'BadRequestError', message: 'application must be shortlisted first'})
            uApp.status = 'accepted'
            uApp.dateOfJoining = new Date()
        } else if (body.status === 'rejected') {  // Prevent reject if application is accepted
            uApp.status = 'rejected'
        } else if (body.status === 'shortlisted') {
            uApp.status = 'shortlisted'
        } else {
            return next({name: 'BadRequestError', message: 'status field must be accepted, rejected or shortlisted'})
        }

        console.log('updating...')
        const upd = await Application.findByIdAndUpdate(appId, uApp, {new: true})
        console.log('updated', upd)
        const positionsCount = await Application.countDocuments({job: application.job._id, status: 'accepted'})
        console.log('here', positionsCount, application.job.maxPositions, positionsCount >= application.job.maxPositions)

        if (positionsCount >= application.job.maxPositions) {
            console.log('inside')
            const updatedJob = {...application.job.toJSON(), positionStatus: 'full'}
            const updJob = await Job.findByIdAndUpdate(application.job._id, updatedJob, {new: true})
            const rej = await Application
                .updateMany(
                    {job: upd.job, _id: {$not: {$eq: upd._id}}},
                    {$set: {status: 'rejected'}})
            console.log('updJob, rej', updJob, rej)
        }

        // Reject all other applications made by that applicant
        if (upd.status === 'accepted') {
            const rej = await Application
                .updateMany(
                    {applicant: upd.applicant, _id: {$not: {$eq: upd._id}}},
                    {$set: {status: 'rejected'}})
            console.log('rejected', rej)
        }

        const updatedApp = await Application.findById(appId).populate('job').populate({
            path: 'applicant',
            model: 'Applicant',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        console.log('updatedApp', updatedApp)
        res.json(updatedApp)
    } catch (err) {
        next(err)
    }
})

module.exports = router
