import React from 'react';
import {
    Modal, Text, Stack, Group, Badge, SimpleGrid, Box, Divider, Button, ScrollArea, Paper
} from '@mantine/core';

const MAPPER = {
    f60: {
        '01': '01 - ATM',
        '04': '04 - Internet Banking',
        '05': '05 - Mobile Banking',
        '06': '06 - SMS Banking',
        '07': '07 - Kênh khác',
        '99': '99 - Thanh toán QR'
    },
    transactionType: { IBFT: 'Chuyển tiền', PAYMENT: 'Thanh toán' },
};

// InfoRow chuẩn đồng bộ tuyệt đối với RefundModal
const InfoRow = ({ label, value, color, fw = 500, isLong = false }) => (
    <Box style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', alignItems: 'baseline', marginBottom: '6px' }}>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={fw} c={color} ta="right" style={{ wordBreak: isLong ? 'break-all' : 'normal' }}>
            {value || '---'}
        </Text>
    </Box>
);

// SectionBlock có khung Paper giống hệt RefundModal
const SectionBlock = ({ title, children }) => (
    <Paper
        withBorder
        p="sm"
        radius="md"
        style={{
            height: '100%',
            backgroundColor: 'var(--mantine-color-body)',
        }}
    >
        <Text fw={700} size="xs" c="blue.5" tt="uppercase" lts="0.5px" mb="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', paddingBottom: '2px' }}>
            {title}
        </Text>
        <Stack gap={0}>{children}</Stack>
    </Paper>
);

const PaymentDetailModal = ({ opened, onClose, record, handlers }) => {
    if (!record) return null;

    const getStatusConfig = (code) => {
        if (code === '00' || code === 'ACSP') return { label: 'THÀNH CÔNG', color: 'green' };
        if (code === '68') return { label: 'TIMEOUT', color: 'yellow' };
        return { label: 'THẤT BẠI', color: 'red' };
    };

    const status = getStatusConfig(record.respcode || record.status);
    const formatMoney = (val) => Number(val || 0).toLocaleString() + ' VND';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={600} size="sm" c="dimmed">Chi tiết giao dịch</Text>}
            size="850px"
            centered
            radius={20}
            padding={0}
            styles={{
                content: { borderRadius: '12px', overflow: 'hidden' },
                header: { borderBottom: '1px solid var(--mantine-color-default-border)', margin: 0, padding: '12px 20px' },
                body: { padding: 0 }
            }}
        >
            <ScrollArea.Autosize mah="calc(100vh - 120px)" p="md">
                <Stack gap="sm">
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">

                        {/* CỘT 1: THÔNG TIN GIAO DỊCH GỐC */}
                        <SectionBlock title="Thông tin giao dịch">
                            <InfoRow label="Số tiền" value={formatMoney(record.amount)} />

                            <Box style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                                <Text size="xs" c="dimmed">Trạng thái</Text>
                                <Group justify="flex-end">
                                    <Badge color={status.color} variant="light" radius="sm">
                                        {status.label} - {record.respcode || record.status || 'N/A'}
                                    </Badge>
                                </Group>
                            </Box>

                            <InfoRow label="Mã tham chiếu" value={record.transRef} isLong />
                            <InfoRow label="Số lưu vết" value={record.traceNo} />
                            <InfoRow label="Số tham chiếu gốc" value={record.refCode} isLong />
                            <InfoRow label="Loại giao dịch" value={MAPPER.transactionType[record.transactionType] || record.transactionType} />
                            <InfoRow label="Kênh" value={MAPPER.f60[record.f60] || record.f60} />
                            <InfoRow label="Mã xử lý" value={record.procCode} />
                        </SectionBlock>

                        {/* CỘT 2: CHI TIẾT ĐỐI TÁC & NỘI DUNG */}
                        <SectionBlock title="Chi tiết đối ứng">
                            <InfoRow label="NH gửi" value={handlers?.getBankName(record.bankId)} />
                            <InfoRow label="TK gửi" value={record.fromAccount} />
                            <InfoRow label="NH nhận" value={handlers?.getBankName(record.benId)} />
                            <InfoRow label="TK nhận" value={record.toAccount} />
                            <InfoRow label="Thời gian GD" value={record.transDate ? new Date(record.transDate).toLocaleString('vi-VN') : '---'} />
                            <InfoRow label="Nội dung" value={record.transContent} isLong />
                            <InfoRow label="Số tiền hoàn trả" value={formatMoney(record.returnedAmount)} />
                        </SectionBlock>
                    </SimpleGrid>

                    <Group justify="flex-end" p="xs">
                        <Button variant="subtle" color="gray" onClick={onClose} radius="xl" size="sm" fw={600}>
                            Đóng
                        </Button>
                    </Group>
                </Stack>
            </ScrollArea.Autosize>
        </Modal>
    );
};

export default PaymentDetailModal;