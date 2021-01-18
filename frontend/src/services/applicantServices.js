import axios from 'axios'

const baseUrl = '/api/applicants'

const getJobsAppliedTo = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/list/applications`, config)
    console.log('response.data', response.data)
    return response.data.map(application => application.job._id)
}

const applicantServices = {
    getJobsAppliedTo
}

export default applicantServices
