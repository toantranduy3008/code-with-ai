import React from 'react';
import {
    Modal, Text, Stack, Group, Badge, SimpleGrid, Box, Divider, Button, ScrollArea, Paper,
    Title
} from '@mantine/core';
import { SectionBlock } from '../components/SectionBlock';
import { InfoRow } from '../components/InfoRow';
import { BaseModal } from '../components/BaseModal';
import { IconCheck } from '@tabler/icons-react';
const MAPPER = {
    f60: {
        '01': '01 - ATM',
        '04': '04 - Internet Banking',
        '05': '05 - Mobile Banking',
        '06': '06 - SMS Banking',
        '07': '07 - Kênh khác',
        '99': '99 - Mã QR'
    },
    transactionType: { IBFT: 'Chuyển tiền', PAYMENT: 'Thanh toán' },
};

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
        <BaseModal
            opened={opened}
            onClose={onClose}
            title="Chi tiết giao dịch"
            size='50%'
        >
            <Stack gap="sm">
                <Paper withBorder p="xl" radius="md" shadow="xs" bg={status.color}>
                    <Stack align="center" gap={4}>
                        <Badge
                            radius="xl"
                            mb="xs"
                            variant='white'
                        >
                            {status.label} - {record.respcode || record.status || 'N/A'}
                        </Badge>

                        <Title order={1} lts={-1}>
                            {formatMoney(record.amount)}
                        </Title>

                        <Text size="xs" fw={500}>
                            Ngày giao dịch: {record.transDate ? new Date(record.transDate).toLocaleString('vi-VN') : '---'}
                        </Text>
                    </Stack>
                </Paper>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    <SectionBlock title="Luồng giao dịch">
                        <InfoRow label="NH gửi" value={handlers?.getBankName(record.bankId)} />
                        <InfoRow label="TK gửi" value={record.fromAccount} />
                        <Divider my="xs" variant='dashed' />
                        <InfoRow label="NH nhận" value={handlers?.getBankName(record.benId)} />
                        <InfoRow label="TK nhận" value={record.toAccount} />
                    </SectionBlock>
                    <SectionBlock title="Thông tin giao dịch">
                        <InfoRow label="Mã phản hồi" value={record.respcode} />
                        <InfoRow label="Mã tham chiếu" value={record.transRef} />
                        <InfoRow label="Số lưu vết" value={record.traceNo} />
                        <InfoRow label="Số tham chiếu " value={record.refCode} />
                        <InfoRow label="Loại giao dịch" value={MAPPER.transactionType[record.transactionType] || record.transactionType} />


                    </SectionBlock>

                    {/* CỘT 2: CHI TIẾT ĐỐI TÁC & NỘI DUNG */}
                    <SectionBlock title="Thông tin bổ sung">
                        <InfoRow label="Nội dung" value={record.transContent} isLong />
                        <InfoRow label="Số tiền hoàn trả" value={formatMoney(record.returnedAmount)} />
                        <InfoRow label="Kênh" value={MAPPER.f60[record.f60] || record.f60} />
                        <InfoRow label="Mã xử lý" value={record.procCode} />
                    </SectionBlock>
                </SimpleGrid>

                <Group justify="flex-end" p="xs">
                    <Button variant="subtle" color="gray" onClick={onClose} radius="xl" size="sm" fw={600}>
                        Đóng
                    </Button>
                </Group>
            </Stack>
        </BaseModal>
    );
};

export default PaymentDetailModal;