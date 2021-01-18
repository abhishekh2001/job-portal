import axios from 'axios'

const baseUrl = '/api/apply'

const applyToJob = async (jobId, body, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    console.log('here', `${baseUrl}/applicant/${jobId}`)
    const response = await axios.post(`${baseUrl}/applicant/${jobId}`, body, config)
    return response.data
}

const applicationService = {
    applyToJob
}

export default applicationService
