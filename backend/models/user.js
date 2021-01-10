const mongoose = require('mongoose')
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'invalid email']
    },
    passwordHash: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['applicant', 'recruiter']
    }
})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
