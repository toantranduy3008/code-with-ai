import { AppShell, NavLink, Group, Button, Text, Avatar, Collapse } from '@mantine/core'
import { IconHome, IconUsers, IconSettings, IconLogout, IconChevronDown, IconArrowsExchange } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import menuConfig from '../config/menuConfig.json'
import ColorSchemeToggle from './ColorSchemeToggle'

// Icon mapping
const iconMap = {
    IconHome,
    IconUsers,
    IconSettings,
    IconArrowsExchange,
}

export default function DashboardLayout({ children }) {
    const [expanded, setExpanded] = useState({})
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

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
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: true },
            }}
            className="bg-slate-50 dark:bg-slate-950"
        >
            <AppShell.Navbar className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                {/* User Info */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <Group gap="sm" justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                            <Avatar name={user?.name || 'User'} color="violet" />
                            <div style={{ minWidth: 0 }}>
                                <Text size="sm" fw={600} className="text-slate-800 dark:text-slate-100 truncate">
                                    {user?.name}
                                </Text>
                                <Text size="xs" className="text-slate-500 dark:text-slate-400 truncate block">
                                    {user?.email}
                                </Text>
                            </div>
                        </Group>
                        <ColorSchemeToggle />
                    </Group>
                </div>

                {/* Navigation from Config */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {renderMenuItems(menuConfig.menus)}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        fullWidth
                        variant="light"
                        color="red"
                        leftSection={<IconLogout size={18} />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </AppShell.Navbar>

            <AppShell.Main className="bg-slate-50 dark:bg-slate-950">
                {children}
            </AppShell.Main>
        </AppShell>
    )
}
