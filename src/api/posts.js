import apiClient from '../config/apiClient'

export const getPost = (id) => apiClient.get(`/posts/${id}`)

