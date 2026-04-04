import {
    Modal,
    Stack,
    Box,
    Paper,
    Group,
    Divider,
    Text,
    Loader
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

const getStatusConfig = (code) => {
    switch (code) {
        case "00":
            return {
                icon: <IconCheck size={55} color="green" />,
                color: "green",
                label: "THÀNH CÔNG"
            };
        case "68":
            return {
                icon: <Loader size={55} color="orange" />,
                color: "orange",
                label: "ĐANG CHỜ XỬ LÝ (TIMEOUT)"
            };
        default:
            return {
                icon: <IconX size={55} color="red" />,
                color: "red",
                label: "THẤT BẠI"
            };
    }
};

export const TransactionResultModal = ({
    opened,
    onClose,
    transactionResult,
    formData,
    onCloseComplete
}) => {
    const status = getStatusConfig(transactionResult?.f39);

    const handleClose = () => {
        onClose();
        if (onCloseComplete) {
            onCloseComplete();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            centered
            radius="xl" // Bo góc tròn hơn nhìn sẽ thân thiện hơn
            size="md"
            withCloseButton={false} // Tự tạo nút đóng ở dưới cho cân đối
            padding={0} // Để mình tùy biến background header
        >
            <Stack gap={0}>
                {/* Phần Header Màu sắc theo trạng thái */}
                <Box
                    p="xl"
                    bg={status.color === 'green' ? 'green.0' : 'red.0'}
                    style={{
                        borderRadius: '24px 24px 0 0',
                        borderBottom: `1px dashed var(--mantine-color-${status.color}-2)`
                    }}
                >
                    <Stack align="center" gap="xs">
                        {/* Hiệu ứng vòng tròn xung quanh Icon */}
                        <Box
                            style={{
                                background: 'white',
                                borderRadius: '50%',
                                padding: '10px',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
                            }}
                        >
                            {status.icon}
                        </Box>
                        <Text size="xl" fw={800} c={`${status.color}.9`} mt="sm" family="monospace">
                            {status.label === 'THÀNH CÔNG' ? 'Giao dịch thành công!' : 'Giao dịch thất bại'}
                        </Text>
                        <Text size="sm" c={`${status.color}.6`} fw={500} family="monospace">
                            {new Date().toLocaleString('vi-VN')}
                        </Text>
                    </Stack>
                </Box>

                {/* Phần Chi tiết Giao dịch */}
                <Box p="xl">
                    <Stack gap="lg">
                        <Box ta="center">
                            <Text size="xs" c="dimmed" tt="uppercase" lts={1} fw={700} mb={5}>Số tiền giao dịch</Text>
                            <Text size="32px" fw={800} c="dark.6">
                                {Intl.NumberFormat('vi-VN').format(formData.amount)}
                                <Text component="span" size="lg" ml={5}>VND</Text>
                            </Text>
                        </Box>

                        <Paper withBorder p="lg" radius="lg" style={{ borderStyle: 'dashed', backgroundColor: '#fafafa' }}>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Người thụ hưởng</Text>
                                    <Text size="sm" fw={600}>{formData.beneficiaryName}</Text>
                                </Group>

                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Mã giao dịch (STAN)</Text>
                                    <Text size="xs" fw={600} family="monospace">{transactionResult?.f11 || 'N/A'}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Mã tham chiếu (F63)</Text>
                                    <Text size="xs" fw={600} family="monospace">{formData?.f63 || 'N/A'}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Nội dung</Text>
                                    <Text size="xs" fw={500} ta="right" style={{ maxWidth: '60%' }}>
                                        {formData.description || 'Chuyển tiền qua QR'}
                                    </Text>
                                </Group>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    );
};
