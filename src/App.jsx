import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Loader, Center } from '@mantine/core'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/DashboardLayout'
import { DashboardPage, UsersPage, SettingsPage } from './pages/DashboardPages'
import { SecuritySettingsPage } from './pages/SecuritySettingsPage'
import TransactionPage from './pages/TransactionPage'
import SearchPaymentPage from './pages/SearchPaymentPage'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="violet" size="lg" />
      </Center>
    )
  }

  if (!user) {
    // return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/transaction  " replace /> : <LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/security"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SecuritySettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TransactionPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search-payment"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SearchPaymentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search-payment/list"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SearchPaymentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/transaction" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

