const mongoose = require('mongoose')
const config = require('../utils/config')
const Applicant = require('../models/applicant')
const User = require('../models/user')

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log(`database connection established`)
})


Applicant.findOne().populate('user').then(response => {
    console.log('response >', response)
})
