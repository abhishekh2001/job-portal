import axios from 'axios'

const baseUrl = '/api/jobs'

const getAll = async () => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

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

const deleteOne = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response
}

const getApplications = async (id) => {
    const response = await axios.get(`${baseUrl}/applications/${id}`)
    return response.data
}

const jobService = {
    postOne,
    updateOne,
    getOne,
    deleteOne,
    getAll,
    getApplications
}

export default jobService
