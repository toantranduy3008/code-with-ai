// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

// BẮT BUỘC: Thêm đầy đủ CSS
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  // Giúp các thành phần có màu sắc ổn định hơn
  components: {
    Paper: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Dùng defaultColorScheme thay vì forceColorScheme 
       để cho phép useMantineColorScheme() hoạt động
    */}
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="bottom-right" zIndex={1000} />
      <App />
    </MantineProvider>
  </StrictMode>,
)