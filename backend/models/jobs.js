const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    maxApplications: {
        type: Number,
        required: true
    },
    maxPositions: {
        type: Number,
        required: true
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
        max: 6
    },
    salaryPerMonth: {
        type: Number,
        required: true
    },
    Rating: {
        type: Number,
        min: 0,
        max: 5
    }
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
