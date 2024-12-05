import axios from 'axios'

const instance = axios.create({
    // baseURL: 'https://codekids-backend.onrender.com'
    // baseURL: 'http://localhost:5555'
    baseURL: 'http://localhost:5556'
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance