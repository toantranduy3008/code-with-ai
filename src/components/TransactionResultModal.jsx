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
            title={<Text fw={700} size="lg">Kết quả giao dịch</Text>}
            centered
            radius="lg"
            size="md"
        >
            <Stack gap="md" py="sm">
                <Box ta="center">
                    <Stack align='center' gap="xs">
                        {status.icon}
                        <Text size="lg" fw={700} c={`${status.color}.7`} mt="sm">
                            GIAO DỊCH {status.label}
                        </Text>
                    </Stack>
                </Box>

                <Paper withBorder p="md" radius="md" bg="gray.0">
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Người thụ hưởng:</Text>
                            <Text size="sm" fw={600} style={{ textTransform: 'uppercase' }}>
                                {formData.beneficiaryName}
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="md" c="dimmed">Số tiền:</Text>
                            <Text size="md" fw={700} c="violet.7">
                                {Intl.NumberFormat('vi-VN').format(formData.amount)} VND
                            </Text>
                        </Group>
                        <Divider label="Chi tiết giao dịch" labelPosition="center" />
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">Mã giao dịch:</Text>
                            <Text size="xs" fw={500}>{transactionResult?.f11 || 'N/A'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">Mã tham chiếu:</Text>
                            <Text size="xs" fw={500}>{formData?.f63 || 'N/A'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">Mã phản hồi:</Text>
                            <Text size="xs" fw={500}>{transactionResult?.f39 || 'N/A'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">Nội dung:</Text>
                            <Text size="xs" fw={500} ta="right" style={{ maxWidth: '60%' }}>
                                {formData.description || 'Chuyển tiền qua QR'}
                            </Text>
                        </Group>
                    </Stack>
                </Paper>
            </Stack>
        </Modal>
    );
};
