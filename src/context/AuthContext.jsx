import { useState } from 'react'
import { AuthContext } from './AuthContextDefinition'

const initializeUser = () => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(initializeUser)
    const [isLoading] = useState(false)

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
