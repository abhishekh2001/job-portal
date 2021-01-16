import axios from 'axios'

const baseUrl = '/api/recruiters'

const getRecruiterJobs = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const response = await axios.get(`${baseUrl}/list/jobs`, config)
    return response.data
}

const recruiterService =  {
    getRecruiterJobs
}

export default recruiterService
