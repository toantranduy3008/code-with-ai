import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme="light">
      <Notifications
        position="bottom-right"
        limit={2}
        containerWidth={360}
        styles={{
          root: {
            width: 'auto',
            maxWidth: 360,
            pointerEvents: 'none',
          },
          notification: {
            pointerEvents: 'auto',
          },
        }}
      />
      <App />
    </MantineProvider>
  </StrictMode>,
)
