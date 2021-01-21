import axios from 'axios'

const baseUrl = '/api/recruiters'

const getRecruiterJobs = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.get(`${baseUrl}/list/jobs`, config)
    return response.data
}

const getRecruiter = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.get(`${baseUrl}/myProfile/details`, config)
    return response.data
}

const updateRecruiter = async (body, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.put(`${baseUrl}`, body, config)
    return response.data
}

const getAcceptedApplications = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.get(`${baseUrl}/list/acceptedApplications`, config)
    return response.data
}

const rateApplicant = async (appId, body, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.put(`${baseUrl}/rate/${appId}`, body, config)
    return response.data
}

const recruiterService =  {
    getRecruiter,
    updateRecruiter,
    getRecruiterJobs,
    getAcceptedApplications,
    rateApplicant
}

export default recruiterService
