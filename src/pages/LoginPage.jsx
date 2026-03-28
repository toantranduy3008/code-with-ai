import { useState } from 'react';
import {
    Container,
    Paper,
    Button,
    Title,
    Text,
    Stack,
    TextInput,
    PasswordInput,
    Image,
    Box,
    Divider,
    Center,
    Group
} from '@mantine/core';
import { useAuth } from '../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../config/toast';
import { IconUser, IconLock, IconLogin } from '@tabler/icons-react';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import apiClient from '../config/apiClient.js';
import napasLogo from '../assets/napas-logo.svg';
import { motion, useAnimation } from 'framer-motion';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });

    const { login } = useAuth();
    const navigate = useNavigate();
    const controls = useAnimation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({ username: '', password: '' });
        if (!username.trim() || !password.trim()) {
            controls.start({
                x: [-10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            });
            return;
        }
        setLoading(true);
        try {
            const result = await apiClient.post('/auth/signin', {
                username: username,
                password: password
            });
            if (result.accessToken) {
                sessionStorage.setItem('token', result.accessToken);
                login(result);
                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: 'Đăng nhập hệ thống thành công',
                });
                navigate('/transaction');
            }
        } catch (error) {
            controls.start({
                x: [-10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            });
            console.error('[Login Error]:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative">
            <div className="absolute top-4 right-4">
                <ColorSchemeToggle />
            </div>

            <Container size="xs" className="w-full max-w-105">
                <motion.div animate={controls}>
                    <Paper
                        withBorder
                        p={40}
                        /* THAY ĐỔI: radius='md' giúp form mềm mại, bớt thô hơn */
                        radius="md"
                        className="bg-white dark:bg-slate-900"
                        style={{
                            /* THAY ĐỔI: Đổ bóng đa lớp để card nổi bật hẳn lên trên nền */
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            borderTop: '4px solid #005baa',
                        }}
                    >
                        <Stack gap="xl">
                            <Center>
                                <Box w={140}>
                                    <Image src={napasLogo} alt="Napas" fit="contain" />
                                </Box>
                            </Center>

                            <Stack gap={4} align="center">
                                <Title order={3} className="text-slate-900 dark:text-white font-extrabold tracking-tight text-center" size={20}>
                                    Hệ thống hỗ trợ kiểm thử
                                </Title>
                            </Stack>

                            <form onSubmit={handleLogin}>
                                <Stack gap="lg">
                                    <TextInput
                                        label={<Text size="xs" fw={700} mb={4}>TÊN ĐĂNG NHẬP</Text>}
                                        placeholder="Nhập username"
                                        size="md"
                                        /* THAY ĐỔI: radius='sm' tạo sự đồng bộ với form */
                                        radius="sm"
                                        leftSection={<IconUser size={18} stroke={1.5} color="#005baa" />}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        styles={{ input: { fontSize: '14px' } }}
                                    />

                                    <PasswordInput
                                        label={<Text size="xs" fw={700} mb={4}>MẬT KHẨU</Text>}
                                        placeholder="Nhập mật khẩu"
                                        size="md"
                                        radius="sm"
                                        leftSection={<IconLock size={18} stroke={1.5} color="#005baa" />}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        styles={{ input: { fontSize: '14px' } }}
                                    />

                                    <Divider my="sm" variant="dashed" />

                                    <Center mt="md">
                                        <Button
                                            fullWidth
                                            type="submit"
                                            loading={loading}
                                            radius="sm"
                                            color="blue.7"
                                            leftSection={<IconLogin size={18} stroke={2} />}
                                            style={{
                                                height: '42px',
                                                // width: '200px', // Cố định chiều rộng vừa phải để không bị thô
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                letterSpacing: '0.5px',
                                                boxShadow: '0 4px 12px rgba(0, 91, 170, 0.15)',
                                            }}
                                        >
                                            ĐĂNG NHẬP
                                        </Button>
                                    </Center>
                                </Stack>
                            </form>
                        </Stack>
                    </Paper>
                </motion.div>

                <Text ta="center" size="xs" c="dimmed" mt="xl" className="opacity-70">
                    Copyright © 2026 **Napas**. All rights reserved.
                </Text>
            </Container>
        </div>
    );
}