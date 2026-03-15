import { notifications } from '@mantine/notifications'

const variantToColor = {
  info: 'blue.5',
  success: 'green.5',
  warning: 'yellow.5',
  error: 'red.5',
}

export const showToast = ({ title, message, variant = 'info', autoClose = 2500, ...rest } = {}) => {
  const color = variantToColor[variant] ?? variantToColor.info
  notifications.show({
    title,
    message,
    color,
    autoClose,
    radius: 'md',
    variant: 'light',
    ...rest,
  })
}

