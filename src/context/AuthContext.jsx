import { useState } from 'react'
import { AuthContext } from './AuthContextDefinition'

const initializeUser = () => {
    const storedUser = sessionStorage.getItem('userSession')
    return storedUser ? JSON.parse(storedUser) : null
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(initializeUser)
    const [isLoading] = useState(false)

    const login = (userData) => {
        setUser(userData)
        sessionStorage.setItem('userSession', JSON.stringify(userData))
        sessionStorage.setItem('token', userData.accessToken)
    }

    const logout = () => {
        setUser(null)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userSession')
        sessionStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
