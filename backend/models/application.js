const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    }
})

applicationSchema.plugin(uniqueValidator,{message: '{PATH} must be unique'})

applicationSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
    }
})

const Application = mongoose.model('Application', applicationSchema)
module.exports = Application
