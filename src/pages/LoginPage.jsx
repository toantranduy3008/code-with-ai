import { useState } from 'react'
import { Container, Paper, Button, Title, Text, Stack, Center, Loader } from '@mantine/core'
import { useAuth } from '../context/useAuth.js'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../config/toast'
import ColorSchemeToggle from '../components/ColorSchemeToggle'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSSOLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate SSO authentication
        setTimeout(() => {
            // Demo: auto-login with default user
            const userData = {
                id: '1',
                email: 'user@example.com',
                name: 'User',
            }

            login(userData)

            showToast({
                variant: 'success',
                title: 'Đăng nhập thành công',
                message: `Chào mừng ${userData.name}`,
            })

            navigate('/dashboard')
            setLoading(false)
        }, 800)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative">
            <div className="absolute top-4 right-4">
                <ColorSchemeToggle />
            </div>
            <Container size="sm" className="w-full max-w-md">
                <Paper withBorder shadow="md" p="xl" radius="lg" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <Stack gap="lg">
                        <div>
                            <Title order={2} className="text-slate-800 dark:text-slate-100 text-center">
                                Chào mừng
                            </Title>
                            <Text size="sm" className="text-slate-500 dark:text-slate-400 text-center mt-1">
                                Đăng nhập vào hệ thống
                            </Text>
                        </div>

                        {loading ? (
                            <Center py="xl">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader color="violet" size="lg" />
                                    <Text size="sm" className="text-slate-500 dark:text-slate-400">
                                        Đang chuyển hướng đến SSO...
                                    </Text>
                                </div>
                            </Center>
                        ) : (
                            <Button
                                fullWidth
                                size="lg"
                                color="violet"
                                onClick={handleSSOLogin}
                                disabled={loading}
                            >
                                Đăng nhập qua hệ thống SSO
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </div>
    )
}
