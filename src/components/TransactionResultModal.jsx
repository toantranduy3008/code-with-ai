import {
    Modal,
    Stack,
    Box,
    Paper,
    Group,
    Divider,
    Text,
    Loader,
    Button,
    useMantineTheme
} from '@mantine/core';
import { IconCheck, IconX, IconCalendarTime } from '@tabler/icons-react';
// Import CSS Modules
import classes from './TransactionResultModal.module.css';

const getStatusConfig = (code) => {
    switch (code) {
        case "00":
            return {
                icon: <IconCheck size={45} stroke={3} />,
                color: "green",
                label: "Giao dịch thành công!"
            };
        case "68":
            return {
                icon: <Loader size={45} />,
                color: "orange",
                label: "Đang chờ xử lý"
            };
        default:
            return {
                icon: <IconX size={45} stroke={3} />,
                color: "red",
                label: "Giao dịch thất bại"
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
    const theme = useMantineTheme();
    const isDark = theme.colorScheme === 'dark';
    const status = getStatusConfig(transactionResult?.f39);

    // Tính toán màu sắc động dựa trên trạng thái Dark Mode
    const dynamicColors = {
        modalBg: isDark ? theme.colors.dark[8] : theme.white,
        headerBg: isDark
            ? (status.color === 'green' ? 'rgba(43, 138, 62, 0.12)' : 'rgba(201, 42, 42, 0.12)')
            : (status.color === 'green' ? theme.colors.green[0] : theme.colors.red[0]),
        textPrimary: isDark ? theme.colors.dark[0] : theme.colors.gray[9],
        amount: isDark ? theme.colors.violet[4] : theme.colors.violet[7],
        border: isDark ? theme.colors.dark[4] : theme.colors.gray[2]
    };

    const handleClose = () => {
        onClose();
        if (onCloseComplete) onCloseComplete();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            centered
            radius="24px"
            size="md"
            withCloseButton={false}
            padding={0}
            styles={{
                content: {
                    backgroundColor: dynamicColors.modalBg,
                    border: isDark ? `1px solid ${theme.colors.dark[5]}` : 'none'
                },
                // overlay: { backdropFilter: 'blur(8px)' }
            }}
            className={classes.modalContent}
        >
            <Stack gap={0}>
                {/* Header Trạng Thái */}
                <Box className={classes.headerStatus} bg={dynamicColors.headerBg}>
                    <Box
                        className={classes.iconWrapper}
                        style={{ backgroundColor: isDark ? theme.colors.dark[6] : theme.white }}
                    >
                        <Box style={{ color: theme.colors[status.color][6], display: 'flex' }}>
                            {status.icon}
                        </Box>
                    </Box>

                    <Text size="lg" fw={800} c={status.color === 'green' ? 'green.5' : 'red.5'}>
                        {status.label}
                    </Text>

                    <Group gap={5} c="dimmed">
                        <IconCalendarTime size={14} />
                        <Text size="xs" fw={500} family="monospace">
                            {new Date().toLocaleString('vi-VN')}
                        </Text>
                    </Group>
                </Box>

                <Box p="xl">
                    <Stack gap="xl">
                        {/* Khu vực Số tiền */}
                        <Box ta="center">
                            <Text size="xs" c="dimmed" tt="uppercase" lts={1.2} fw={700} mb={4}>Số tiền giao dịch</Text>
                            <Text size="32px" fw={700} c={dynamicColors.amount} className={classes.amountText}>
                                {Intl.NumberFormat('vi-VN').format(formData?.amount || 0)}
                                <Text component="span" size="lg" ml={6} fw={700}>VND</Text>
                            </Text>
                        </Box>

                        {/* Tờ biên lai chi tiết */}
                        <Paper
                            p="lg"
                            radius="xl"
                            withBorder
                            className={classes.receiptPaper}
                            style={{ borderColor: dynamicColors.border }}
                        >
                            <Stack gap="md">
                                <DetailRow label="Mã phản hồi" value={transactionResult?.f39} colors={dynamicColors} isMono />
                                <DetailRow label="Người thụ hưởng" value={formData?.beneficiaryName} colors={dynamicColors} />
                                <DetailRow label="Số lưu vết" value={transactionResult?.f11} colors={dynamicColors} isMono />

                                <DetailRow label="Mã tham chiếu (F63)" value={formData?.f63} colors={dynamicColors} isMono />
                                <DetailRow label="Nội dung" value={formData?.description || 'Chuyển tiền qua App'} colors={dynamicColors} />
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    );
};

// Component hỗ trợ hiển thị dòng chi tiết
const DetailRow = ({ label, value, colors, isMono }) => (
    <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{label}</Text>
        <Text
            size="sm"
            fw={600}
            c={colors.textPrimary}
            ta="right"
            family={isMono ? 'monospace' : 'inherit'}
            style={{ wordBreak: 'break-all' }}
        >
            {value || 'N/A'}
        </Text>
    </Group>
);