import axios from 'axios'

const baseUrl = '/api/jobs'

const postOne = async (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.post(`${baseUrl}`, data, config)
    return response.data
}

const jobService = {
    postOne
}

export default jobService
