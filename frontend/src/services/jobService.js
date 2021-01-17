import axios from 'axios'

const baseUrl = '/api/jobs'

const postOne = async (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.post(`${baseUrl}`, data, config)
    return response.data
}

const updateOne = async (id, data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    console.log('updating...')
    const response = await axios.put(`${baseUrl}/${id}`, data, config)
    console.log('updateOne', response.data)
    return response.data
}

const getOne = async(id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const jobService = {
    postOne,
    updateOne,
    getOne
}

export default jobService
