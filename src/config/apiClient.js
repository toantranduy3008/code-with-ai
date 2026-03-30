import axios from 'axios'
import { showToast } from '../config/toast' // Giả định đường dẫn đến hàm toast của bạn

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
  baseURL: import.meta.env.VITE_API_BASE_URL || '/bankdemo/api',
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config) => {
    // Sử dụng 'token' hoặc 'authToken' tùy theo cách bạn lưu ở LoginPage
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      console.debug(`🚀 [API] ${config.method?.toUpperCase()} -> ${config.url}`, config.params || config.data || '');
    }

    return config
  },
  (error) => Promise.reject(error),
)

const mapStatusToMessage = (status) => {
  switch (status) {
    case 400: return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
    case 401: return 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.'
    case 403: return 'Bạn không có quyền thực hiện thao tác này.'
    case 404: return 'Không tìm thấy tài nguyên yêu cầu.'
    case 500: return 'Lỗi hệ thống phía Server. Vui lòng thử lại sau.'
    default: return 'Đã có lỗi xảy ra, vui lòng thử lại.'
  }
}

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status
    let message = mapStatusToMessage(status)
    if (error.response?.data?.message) {
      message = error.response.data.message
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Kết nối quá hạn. Vui lòng kiểm tra mạng.'
    }

    // --- TỰ ĐỘNG HIỂN THỊ TOAST LỖI ---
    showToast({
      variant: 'error',
      title: 'Lỗi hệ thống',
      message: message
    })

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