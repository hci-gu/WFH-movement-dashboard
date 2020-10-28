import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: ACCESS_TOKEN,
  },
})

export const getDashboard = async () => {
  const response = await api.get('/analytics/dashboard')

  return response.data
}

export const getUserRegistrations = async () => {
  const response = await api.get('/analytics/userRegistrations')

  return response.data
}
