const mongoose = require('mongoose')

const recruiterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Do we need to index? <I guess so; 10/1>
    },
    contactNumber: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 250
    }
})

recruiterSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
    }
})

const Recruiter = mongoose.model('Recruiter', recruiterSchema)

module.exports = Recruiter
