import axios from 'axios'

const baseUrl = '/api/applicants'

const getApplicant = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/myProfile/details`, config)
    return response.data
}

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

const getJobRating = async (jobId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/rating/${jobId}`, config)
    return response.data
}

const applicantServices = {
    getApplicant,
    getJobsAppliedTo,
    getApplications,
    getJobRating
}

export default applicantServices
