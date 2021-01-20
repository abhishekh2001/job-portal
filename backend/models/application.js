const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    sop: {
        type: String,
        maxlength: 250,
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    dateOfApplication: {
        type: Date,
        default: Date.now
    },
    dateOfJoining: {
        type: Date,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'applied', 'shortlisted'],
        default: 'applied'
    }
})

applicationSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
    }
})

const Application = mongoose.model('Application', applicationSchema)
module.exports = Application
