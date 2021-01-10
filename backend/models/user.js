const mongoose = require('mongoose')
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email cannot be empty'],
        unique: true,
        validate: [validator.isEmail, 'invalid email format']
    },
    name: {
        type: String,
        required: [true, 'name cannot be empty']
    },
    passwordHash: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['applicant', 'recruiter'],
        required: [true, 'type of user must be specified']
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

userSchema.plugin(uniqueValidator,{message: '{PATH} must be unique'})

const User = mongoose.model('User', userSchema)

module.exports = User
