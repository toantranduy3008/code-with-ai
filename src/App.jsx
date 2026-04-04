import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Loader, Center, Box } from '@mantine/core';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// Import Pages
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { DashboardPage, UsersPage, SettingsPage } from './pages/DashboardPages';
import TransactionPage from './pages/TransactionPage';
import { BaseSearchPage } from './components/BaseSearchPage';
import IncomingPaymentPage from './pages/IncomingPaymentPage';
import OutgoingPaymentPage from './pages/OutgoingPaymentPage';
import OutgoingDisputePage from './pages/OutgoingDisputePage';
import IncomingDisputePage from './pages/IncomingDisputePage';

// Component bảo vệ và bọc Layout dùng chung
function ProtectedDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/bankdemo/app/login" replace />;
  }

  return (
    <DashboardLayout>
      {/* Thêm Box nền xám nhạt để làm nổi bật các component bên trong */}
      <Box bg="var(--mantine-color-body)" mih="100vh" p="md" style={{ transition: 'background 0.3s' }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/bankdemo/app/login"
        element={user ? <Navigate to="/bankdemo/app/transaction" replace /> : <LoginPage />}
      />

      {/* Toàn bộ các trang cần bảo vệ và dùng Dashboard Layout nằm ở đây */}
      <Route element={<ProtectedDashboard />}>
        <Route path="/bankdemo/app/dashboard" element={<DashboardPage />} />
        <Route path="/bankdemo/app/users" element={<UsersPage />} />

        {/* Nhóm Settings */}
        <Route path="/bankdemo/app/settings" element={<SettingsPage />} />

        {/* Nhóm Giao dịch */}
        <Route path="/bankdemo/app/transaction" element={<TransactionPage />} />

        {/* Cấu trúc các trang Tìm kiếm (Generic) */}
        <Route path="/bankdemo/app/search">
          <Route
            path="incoming-payment"
            element={<IncomingPaymentPage />}
          />
          <Route
            path="outgoing-payment"
            element={<OutgoingPaymentPage />}
          />
          <Route
            path="incoming-dispute"
            element={<IncomingDisputePage />}
          />
          <Route
            path="outgoing-dispute"
            element={<OutgoingDisputePage />}
          />
          <Route
            path="transaction-logs"
            element={<BaseSearchPage configId="transaction-logs" />}
          />
        </Route>
      </Route>

      {/* Điều hướng mặc định */}
      <Route path="/" element={<Navigate to="/bankdemo/app/login" replace />} />
      <Route path="*" element={<Navigate to="/bankdemo/app/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;