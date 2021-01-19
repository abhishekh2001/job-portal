import axios from 'axios'

const baseUrl = '/api/applicants'

const getJobsAppliedTo = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/list/applications`, config)
    return response.data.map(application => application.job._id)
}

const getApplications = async (token) => {
    const config = {
        headers :{ Authorization: `Bearer ${token}`}
    }
    const response = await axios.get(`${baseUrl}/list/applications`, config)
    return response.data
}

const applicantServices = {
    getJobsAppliedTo,
    getApplications
}

export default applicantServices
