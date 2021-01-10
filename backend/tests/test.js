const mongoose = require('mongoose')
const config = require('../utils/config')
const Applicant = require('../models/applicant')
const User = require('../models/user')
const Recruiter = require('../models/recruiter')

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log(`database connection established`)
})

const recruiter = new Recruiter({
    user: '5ffa980976d7e80940effc4f',
    name: 'Max Jason',
    contactNumber: '123123',
    bio: 'nwe boie haha',
})

Recruiter.findOne().populate('user').then(response => {
    console.log('response', response)
})