const mongoose = require('mongoose')
const validators = require('../utils/validators')

const applicantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Do we need to index? <I guess so; 10/1>
    },
    education: [
        {
            instituteName: String,
            startYear: {
                type: Number,
                required: true,
                validate: {
                    validator: validators.yearValidator,
                    message: props => `${props.value} is not a valid year`
                }
            },
            endYear: {
                type: Number,
                validate: {
                    validator: validators.yearValidator,
                    message: props => `${props.value} is not a valid year`
                }
            }
        }
    ],
    skills: [
        {
            type: String
        }
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratings: [
        {
            recruiter: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recruiter'
            },
            value: {
                type: Number,
                min: 0,
                max: 5
            }
        }
    ],
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

applicantSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v
    }
})


const Applicant = mongoose.model('Applicant', applicantSchema)

module.exports = Applicant
