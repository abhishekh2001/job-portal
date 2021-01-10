const mongoose = require('mongoose')

const recruiterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Do we need to index? <I guess so; 10/1>
    },
    contactNumber: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 250
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
})

recruiterSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Recruiter = mongoose.model('Recruiter', recruiterSchema)

module.exports = Recruiter
