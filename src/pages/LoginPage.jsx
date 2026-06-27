import { useState, useEffect } from 'react';
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
    Center
} from '@mantine/core';
import { useAuth } from '../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../config/toast';
import { IconUser, IconLock, IconLogin } from '@tabler/icons-react';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import apiClient from '../config/apiClient.js';
import napasLogo from '../assets/napas-logo.svg';
import { motion, useAnimation } from 'framer-motion';
import DifyChatbot from '../components/DifyChatbot.jsx';

// Khởi tạo object cấu hình ở Global Scope
if (typeof window !== 'undefined') {
    window.difyChatbotConfig = {
        token: 'F2iaGu6lzc1J1luc',
        baseUrl: 'https://ai-tckt.napas.com.vn',
        inputs: {},
        systemVariables: {},
        userVariables: {},
    };
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });

    const { login } = useAuth();
    const navigate = useNavigate();
    const controls = useAnimation();

    useEffect(() => {
        const scriptId = 'F2iaGu6lzc1J1luc';
        const styleId = 'dify-chatbot-custom-style';

        // 1. Inject Style tùy chỉnh vào head
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                #dify-chatbot-bubble-button {
                    background-color: #1C64F2 !important;
                    position: fixed !important;
                    bottom: 24px !important;
                    right: 24px !important;
                    z-index: 999999 !important;
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                #dify-chatbot-bubble-window {
                    width: 24rem !important;
                    height: 40rem !important;
                    position: fixed !important;
                    bottom: 90px !important;
                    right: 24px !important;
                    z-index: 999999 !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Hàm hỗ trợ khởi tạo lại Dify nếu SDK đã được nạp vào window
        const initDify = () => {
            if (window.Chatbot && typeof window.Chatbot.init === 'function') {
                window.Chatbot.init(window.difyChatbotConfig);
            } else if (typeof window.initDifyChatbot === 'function') {
                window.initDifyChatbot();
            }
        };

        // 2. Tạo và kiểm soát vòng đời Script
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.src = 'https://ai-tckt.napas.com.vn/embed.min.js';
            script.id = scriptId;
            script.async = true;

            // ÉP BUỘC CHẠY KHỞI TẠO NGAY KHI FILE SCRIPT TẢI VỀ THÀNH CÔNG
            script.onload = () => {
                setTimeout(() => {
                    initDify();
                }, 200); // Delay nhẹ 200ms để đảm bảo bộ nhớ window được đồng bộ
            };

            document.body.appendChild(script);
        } else {
            // Trường hợp quay lại trang Login và script đã nằm sẵn trong DOM
            initDify();
        }

        // Dọn dẹp chatbot khi rời khỏi trang Đăng nhập
        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) existingScript.remove();

            const existingStyle = document.getElementById(styleId);
            if (existingStyle) existingStyle.remove();

            const bubbleBtn = document.getElementById('dify-chatbot-bubble-button');
            const bubbleWin = document.getElementById('dify-chatbot-bubble-window');
            if (bubbleBtn) bubbleBtn.remove();
            if (bubbleWin) bubbleWin.remove();
        };
    }, []);

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative flex flex-col justify-between">
            {/* Nút chuyển đổi Dark/Light mode */}
            <div className="absolute top-4 right-4 z-50">
                <ColorSchemeToggle />
            </div>

            {/* Bố cục chính chia làm 2 cột */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl w-full mx-auto px-6 py-8">
                {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                    <Container size="xs" className="w-full max-w-105 m-0 p-0">
                        <motion.div animate={controls}>
                            <Paper
                                withBorder
                                p={40}
                                radius="md"
                                className="bg-white dark:bg-slate-900"
                                style={{
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
                    </Container>
                </div>
            </div>

            {/* Footer bản quyền */}
            <Text ta="center" size="xs" c="dimmed" pb="xl" className="opacity-70">
                Copyright © 2026 **Napas**. All rights reserved.
            </Text>

            <DifyChatbot />
        </div>
    );
}