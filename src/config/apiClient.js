import axios from 'axios'

export class ApiError extends Error {
  constructor(message, { status, data, code } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status ?? null
    this.data = data ?? null
    this.code = code ?? null
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // 10 seconds
})

// Attach auth headers & simple logging for every request
apiClient.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('authToken')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      // Lightweight request log in dev mode only
      // eslint-disable-next-line no-console
      console.debug('[api] request', config.method?.toUpperCase(), config.url, {
        params: config.params,
      })
    }

    return config
  },
  (error) => Promise.reject(error),
)

const mapStatusToMessage = (status) => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.'
    case 401:
      return 'You are not authorized. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    default:
      if (status && status >= 500) {
        return 'The server encountered an error. Please try again later.'
      }
      return 'An unexpected error occurred.'
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Handle request timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(
        new ApiError('Request timed out. Please try again.', {
          status: status ?? 0,
          data: error.response?.data,
          code: error.code,
        }),
      )
    }

    const message = mapStatusToMessage(status)

    return Promise.reject(
      new ApiError(message, {
        status,
        data: error.response?.data,
        code: error.code,
      }),
    )
  },
)

export default apiClient

