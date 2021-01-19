const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: [true, 'job must be posted by a recruiter']
    },
    maxApplications: {
        type: Number,
        required: true,
        min: [0, 'must be positive']
    },
    maxPositions: {
        type: Number,
        required: true,
        min: [0, 'must be positive']
    },
    dateOfPosting: {  // Set default to current date value?
        type: Date,
        required: true
    },
    deadline: {  // How do we deal with this (hours, minutes)?
        type: Date,
        required: true
    },
    skillSetsRequired: [
        {
            type: String
        }
    ],
    typeOfJob: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Work from Home'],  // Can possible improve this
        required: true
    },
    duration: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    },
    applicationStatus: {
        type: String,
        enum: ['free', 'full'],
        default: 'free'
    },
    positionStatus: {
        type: String,
        enum: ['free', 'full'],
        default: 'free'
    },
    salaryPerMonth: {
        type: Number,
        required: true,
        min: [0, 'salary must be positive']
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratings: [
        {
            applicant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Applicant'
            },
            value: {
                type: Number,
                min: 0,
                max: 5
            }
        }
    ]
})

jobSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
    }
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
