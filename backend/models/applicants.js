const mongoose = require('mongoose')
const validator = require('validator')
const validators = require('../utils/validators')

const applicantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'invalid mail']
    },
    education: [
        {
            instituteName: String,
            startYear: {
                type: Number,
                required: true,
                validate: {
                    validator: validators.yearValidator,
                    message: props => `${props.value} is not a valid year!`
                }
            },
            endYear: {
                type: Number,
                validate: {
                    validator: validators.yearValidator,
                    message: props => `${props.value} is not a valid year!`
                }
            }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

const Applicant = mongoose.model('Applicant', applicantSchema)

module.exports = Applicant
