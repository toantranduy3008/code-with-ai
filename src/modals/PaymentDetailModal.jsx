import React from 'react';
import { Modal, Text, Divider, Stack, Group, Badge, ScrollArea, SimpleGrid, Box } from '@mantine/core';

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

const InfoCell = ({ label, value, color, fw = 500 }) => (
    <Group justify="space-between" wrap="nowrap" gap="xl">
        <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>{label}</Text>
        <Text size="sm" fw={fw} c={color} ta="right" style={{ wordBreak: 'break-all' }}>
            {value || '---'}
        </Text>
    </Group>
);

const SectionTitle = ({ children }) => (
    <Text fw={600} size="xs" c="blue.7" tt="uppercase" lts="0.5px" mb={4}>
        {children}
    </Text>
);

const PaymentDetailModal = ({ opened, onClose, record, handlers }) => {
    if (!record) return null;

    // Logic trạng thái dựa trên respCode
    const getStatusConfig = (code) => {
        if (code === '00') return { label: 'THÀNH CÔNG', color: 'green' };
        if (code === '68') return { label: 'TIMEOUT', color: 'yellow' };
        return { label: 'THẤT BẠI', color: 'red' };
    };

    const status = getStatusConfig(record.respcode);
    const badgeLabel = `${status.label} - ${record.respcode || 'N/A'}`;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={600} size="sm" c="dimmed">CHI TIẾT GIAO DỊCH</Text>}
            size="xl"
            centered
            scrollAreaComponent={ScrollArea.Autosize}
            styles={{
                content: { borderRadius: '12px' },
                header: { borderBottom: '1px solid #f1f3f5', marginBottom: '10px', padding: '12px 20px' },
                body: { padding: '15px 25px' }
            }}
        >
            <Stack gap="lg">
                {/* Header: Số tiền & Badge trạng thái mới */}
                <Group justify="space-between" align="center">
                    <Text size="24px" fw={700} c="blue.9">
                        {Number(record.amount).toLocaleString()} <Text span size="xs" fw={500}>VND</Text>
                    </Text>

                    <Badge
                        variant="outline" // Dùng outline để Badge thanh thoát hơn
                        color={status.color}
                        size="lg"
                        radius="xl"
                        h={32}
                        px={15}
                        styles={{
                            root: {
                                backgroundColor: `var(--mantine-color-${status.color}-light)`, // Nền siêu nhạt
                                border: `1px solid var(--mantine-color-${status.color}-light-hover)`,
                                textTransform: 'none',
                                letterSpacing: '0.3px'
                            },
                            label: { fontWeight: 700, fontSize: '13px' }
                        }}
                        leftSection={<Box w={6} h={6} style={{ borderRadius: '50%', backgroundColor: `var(--mantine-color-${status.color}-filled)` }} />}
                    >
                        {badgeLabel}
                    </Badge>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={60} verticalSpacing="xs">
                    {/* CỘT 1: THÔNG TIN GIAO DỊCH */}
                    <Stack gap={6}>
                        <SectionTitle>Thông tin giao dịch</SectionTitle>
                        <InfoCell label="Số lưu vết" value={record.traceNo} />
                        <InfoCell label="Số tham chiếu" value={record.refCode} />
                        <InfoCell label="Mã tham chiếu" value={record.transRef} />
                        <InfoCell label="Loại giao dịch" value={MAPPER.transactionType[record.transactionType]} />
                        <InfoCell label="Kênh" value={MAPPER.f60[record.f60] || record.f60} />
                        <InfoCell label="Mã xử lý" value={record.procCode} />
                    </Stack>

                    {/* CỘT 2: THỜI GIAN & ĐỐI TÁC */}
                    <Stack gap={6}>
                        <SectionTitle>Thời gian & Tài khoản</SectionTitle>
                        <InfoCell label="Ngày quyết toán" value={record.settlementDate} />
                        <InfoCell label="Thời gian hệ thống" value={new Date(record.transDate).toLocaleString('vi-VN')} />
                        <Divider my={4} variant="dotted" />
                        <InfoCell label="NH phát (Gửi)" value={handlers?.getBankName(record.bankId)} />
                        <InfoCell label="TK gửi" value={record.fromAccount} />
                        <InfoCell label="NH nhận" value={handlers?.getBankName(record.benId)} />
                        <InfoCell label="TK nhận" value={record.toAccount} />
                    </Stack>
                </SimpleGrid>

                <Divider size="xs" color="gray.1" />

                {/* THÔNG TIN BỔ SUNG: 2 cột đối xứng */}
                <Box>
                    <SectionTitle>Thông tin bổ sung</SectionTitle>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={60} mt={8} align="flex-start">
                        <InfoCell
                            label="Số tiền hoàn trả"
                            value={Number(record.returnedAmount || 0).toLocaleString() + ' VND'}
                            color="orange.8"
                        />
                        <Group justify="space-between" wrap="nowrap" gap="xl">
                            <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>Nội dung</Text>
                            <Text size="sm" fw={500} c="dark.4" ta="right" style={{ wordBreak: 'break-all', flex: 1 }}>
                                {record.transContent || '---'}
                            </Text>
                        </Group>
                    </SimpleGrid>
                </Box>
            </Stack>
        </Modal>
    );
};

export default PaymentDetailModal;