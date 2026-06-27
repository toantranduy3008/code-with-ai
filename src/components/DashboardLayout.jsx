
import { AppShell, NavLink, Group, Button, Text, Avatar, Collapse, ScrollArea, Box, UnstyledButton, Tooltip } from '@mantine/core'
import { IconHome, IconUsers, IconSettings, IconLogout, IconChevronDown, IconArrowsExchange, IconSearch, IconChevronLeft, IconMenu2, IconChevronRight } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import menuConfig from '../config/menuConfig.json'
import ColorSchemeToggle from './ColorSchemeToggle'
import { useDisclosure } from '@mantine/hooks';
import classes from './DashboardLayout.module.css' // Import CSS Modules;
import DiffyChatbot from './DifyChatbot.jsx'

// Icon mapping
const iconMap = {
    IconHome,
    IconUsers,
    IconSettings,
    IconArrowsExchange,
    IconSearch
}

export default function DashboardLayout({ children }) {
    const [expanded, setExpanded] = useState({})
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [opened, { toggle }] = useDisclosure(true);
    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleExpand = (menuId) => {
        setExpanded(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }))
    }

    const handleMenuClick = (path) => {
        navigate(path)
    }

    const renderMenuItems = (items, level = 0) => {
        return items.map((item) => {
            const IconComponent = iconMap[item.icon]
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expanded[item.id]
            const isActive = location.pathname === item.path

            return (
                <div key={item.id}>
                    <NavLink
                        label={item.label}
                        leftSection={
                            level === 0 && IconComponent ? (
                                <IconComponent size={18} />
                            ) : null
                        }
                        rightSection={
                            hasChildren ? (
                                <IconChevronDown
                                    size={16}
                                    style={{
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 200ms ease',
                                    }}
                                />
                            ) : null
                        }
                        active={isActive}
                        onClick={() => {
                            if (hasChildren) {
                                toggleExpand(item.id)
                            } else {
                                handleMenuClick(item.path)
                            }
                        }}
                        pl={level * 16}
                        className={`cursor-pointer rounded transition-colors ${isActive
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    />
                    {hasChildren && (
                        <Collapse in={isExpanded}>
                            <div className="space-y-1">
                                {item.children.map((child) => {
                                    const isChildActive = location.pathname === child.path
                                    return (
                                        <NavLink
                                            key={child.id}
                                            label={child.label}
                                            pl={level * 16 + 32}
                                            active={isChildActive}
                                            onClick={() => handleMenuClick(child.path)}
                                            className={`cursor-pointer rounded transition-colors text-sm ${isChildActive
                                                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                                                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                                                }`}
                                        />
                                    )
                                })}
                            </div>
                        </Collapse>
                    )}
                </div>
            )
        })
    }

    return (
        <AppShell
            layout="alt"
            navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: !opened } }}
            styles={{
                root: { backgroundColor: 'var(--mantine-color-body)' },
                main: {
                    backgroundColor: 'var(--mantine-color-body)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }
            }}

        >
            <AppShell.Navbar
                p="md"
                style={{
                    backgroundColor: 'var(--mantine-color-body)',
                    borderRight: '1px solid var(--mantine-color-default-border)'
                }}
            >
                <AppShell.Section pb="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
                    <Group justify="space-between" wrap="nowrap" gap={4}>
                        {/* Khối bên trái: Avatar + Tên */}
                        <UnstyledButton
                            className={classes.userButton}
                            onClick={() => navigate('/bankdemo/app/account-info')}
                            style={{ flex: 1, minWidth: 0 }} // Quan trọng: minWidth: 0 để truncate hoạt động
                        >
                            <Group gap="sm" wrap="nowrap">
                                <Avatar
                                    src={user?.avatar}
                                    radius="xl"
                                    color="violet"
                                    variant="light"
                                    name={user?.username}
                                    size="md" // Cố định size để không bị bóp méo
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text size="sm" fw={700} truncate="end">
                                        {user?.username || 'toantd'}
                                    </Text>
                                    <Text size="xs" c="dimmed" truncate="end">
                                        {user?.fullName || 'Quản trị viên'}
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        {/* Khối bên phải: Toggle Darkmode */}
                        <Box pr="xs">
                            <ColorSchemeToggle />
                        </Box>
                    </Group>
                </AppShell.Section>
                {/* Body: Navigation - Dùng ScrollArea để menu không bị tràn */}
                <AppShell.Section grow component={ScrollArea} my="md">
                    <div className="space-y-1">
                        {renderMenuItems(menuConfig.menus)}
                    </div>
                </AppShell.Section>

                {/* Footer: Logout */}
                <AppShell.Section pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
                    <Button
                        fullWidth
                        variant="light"
                        color="red"
                        leftSection={<IconLogout size={18} />}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                <Box style={{ flex: 1, backgroundColor: 'var(--mantine-color-body)' }}>
                    {children}
                    <DiffyChatbot />
                </Box>

            </AppShell.Main>
        </AppShell>
    )
}