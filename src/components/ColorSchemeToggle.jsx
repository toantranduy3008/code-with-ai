import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

export default function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  const toggle = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ActionIcon
      onClick={toggle}
      variant="default"
      size="lg"
      aria-label={computedColorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon size={18} stroke={1.5} />
      ) : (
        <IconSun size={18} stroke={1.5} />
      )}
    </ActionIcon>
  )
}
