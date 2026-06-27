import { useState, useEffect } from 'react';
import {
    Paper, Text, Grid, TextInput, NumberInput,
    Select, Button, Group, Divider, LoadingOverlay, Box,
    Container
} from '@mantine/core';
import { IconUser, IconShieldCheck, IconSend } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../config/apiClient';
import { useBankList } from '../hooks/useBankList';

export default function AccountInfo() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [simulationCases, setSimulationCases] = useState([]);
    const { banks } = useBankList();

    // 1. Fetch dữ liệu ban đầu
    useEffect(() => {
        const initData = async () => {
            try {
                const [userInfo, simRes] = await Promise.all([
                    apiClient.get('/userAccount/currentInfo'),
                    apiClient.get('/simulationCase')
                ]);

                setUserData({ ...userInfo, simulationCaseId: userInfo.simulationCase?.id }); // Đảm bảo có simulationCaseId để bind với Select
                setSimulationCases(simRes.map(item => ({
                    value: item.id.toString(),
                    label: item.caseDescription
                })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    const handleFieldChange = (field, value) => {
        console.log(`Updating field ${field} to value:`, value);
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 3. Hàm gọi API Update (PUT)
    const handleUpdate = async () => {
        setLoading(true);
        const requestBody = {
            fullName: userData.fullName,
            accountNumber: userData.accountNumber,
            cardNumber: userData.cardNumber,
            bankId: userData.bankId,
            addressLine: userData.addressLine,
            simulationCaseId: Number(userData.simulationCaseId), // Chuyển về số nếu API cần
            balance: userData.accountBalance,
            merchantCode: userData.merchantCode,
            merchantName: userData.merchantName,
            accountType: userData.accountType
        };

        try {
            await apiClient.put('/userAccount/currentInfo', requestBody);
            notifications.show({
                title: 'Thành công',
                message: 'Thông tin tài khoản đã được cập nhật',
                color: 'green'
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) return <Box pos="relative" h={300}><LoadingOverlay visible /></Box>;

    return (

        <Container size="sm" py="xl">
            <Paper withBorder shadow="md" p="xl" radius="lg" style={{ maxWidth: 1000, margin: '0 auto' }}>
                <Group mb="lg">
                    <IconUser size={28} color="var(--mantine-color-violet-filled)" />
                    <Text fw={700} size="xl">Thông tin tài khoản</Text>
                </Group>

                <Divider mb="xl" variant="dashed" />

                <Grid gutter="md">
                    {/* Cột Trái */}
                    <Grid.Col span={6}>
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <TextInput label="Tài khoản" value={userData?.username || ''} readOnly variant="filled" />

                            <TextInput
                                label="Tên người dùng"
                                value={userData?.fullName || ''}
                                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                            />

                            <TextInput
                                label="Số tài khoản"
                                value={userData?.accountNumber || ''}
                                onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                            />

                            <TextInput
                                label="Số thẻ"
                                value={userData?.cardNumber || ''}
                                onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
                            />

                            <NumberInput
                                label="Số dư"
                                value={userData?.accountBalance}
                                onChange={(val) => handleFieldChange('accountBalance', val)}
                                thousandSeparator=","
                                suffix=" VND"
                                hideControls
                            />

                            <TextInput
                                label="Tên Merchant"
                                value={userData?.merchantName || ''}
                                onChange={(e) => handleFieldChange('merchantName', e.target.value)}
                            />
                        </Box>
                    </Grid.Col>

                    {/* Cột Phải */}
                    <Grid.Col span={6}>
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <TextInput
                                label="Địa chỉ"
                                value={userData?.addressLine || ''}
                                onChange={(e) => handleFieldChange('addressLine', e.target.value)}
                            />

                            <Select
                                label="Trạng thái"
                                data={['ACTIVE', 'INACTIVE']}
                                value={userData?.status}
                                onChange={(val) => handleFieldChange('status', val)}
                            />

                            <Select
                                label="Ngân hàng"
                                data={banks}
                                value={userData?.bankId}
                                onChange={(val) => handleFieldChange('bankId', val)}
                                searchable
                            />

                            <Select
                                label="Trường hợp giả lập"
                                data={simulationCases}
                                value={userData?.simulationCaseId?.toString() || ''}
                                onChange={(val) => handleFieldChange('simulationCaseId', val)}
                                searchable
                            />

                            <TextInput label="Phân quyền" value={userData?.role || ''} readOnly variant="filled" />

                            <Select
                                label="Loại tài khoản"
                                data={[
                                    { value: 'IBFT', label: 'Chuyển tiền' },
                                    { value: 'PAYMENT', label: 'Thanh toán' },
                                ]}
                                value={userData?.accountType}
                                onChange={(val) => handleFieldChange('accountType', val)}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>

                <Divider my="xl" />

                <Group justify="flex-end">
                    <Button
                        color="violet"
                        onClick={handleUpdate}
                        loading={loading}
                        leftSection={<IconSend size={18} />}
                    >
                        Xác nhận cập nhật
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
}