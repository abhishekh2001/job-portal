import axios from 'axios'

const baseUrl = '/api/auth'

const register = async (data) => {
    const response = await axios.post(`${baseUrl}/register`, data)
    return response.data
}

const login = async (data) => {
    const response = await axios.post(`${baseUrl}/login`, data)
    return response.data
}

export default {
    register,
    login
}