import React, { useEffect } from 'react';
import {
    Modal, Button, NumberInput, Stack, Group,
    Text, Box, Select, Textarea, FileInput, Divider,
    ScrollArea, SimpleGrid, Paper, Grid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    IconCash, IconUpload, IconChevronDown,
    IconSend, IconInfoCircle
} from '@tabler/icons-react';

const MAPPER = {
    transactionType: { IBFT: 'Chuyển tiền', PAYMENT: 'Thanh toán' },
};

// Component hiển thị dòng thông tin
const InfoRow = ({ label, value, color, fw = 500, isLong = false }) => (
    <Box style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
        <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{label}</Text>
        <Text size="sm" fw={fw} c={color} ta="right" style={{ wordBreak: isLong ? 'break-all' : 'normal' }}>
            {value || '---'}
        </Text>
    </Box>
);

// Component khối thông tin (giống Modal Hoàn trả/Chi tiết)
const SectionBlock = ({ title, children }) => (
    <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-body)">
        <Text fw={700} size="xs" c="blue.5" tt="uppercase" lts="0.5px" mb="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', paddingBottom: '4px' }}>
            {title}
        </Text>
        <Stack gap={0}>{children}</Stack>
    </Paper>
);

export function DisputeModal({ opened, onClose, record, onConfirm, loading, type = "TCPL", handlers }) {
    const form = useForm({
        initialValues: {
            disputeType: '',
            content: '',
            amount: 0,
            investigationCode: '',
            attachment: null,
        },
        validate: {
            disputeType: (value) => (!value ? 'Vui lòng chọn loại tra soát' : null),
            content: (value) => (value?.trim().length < 5 ? 'Nội dung quá ngắn' : null),
        },
    });

    // Khởi tạo lại form mỗi khi mở Modal
    useEffect(() => {
        if (opened && record) {
            form.initialize({
                disputeType: '',
                content: '',
                amount: record.amount || 0,
                investigationCode: '',
                attachment: null,
            });
        } else if (!opened) {
            form.reset();
        }
    }, [opened, record]);

    const getInvestigationOptions = () => {
        if (type === "TCNL") return [{ value: 'RQSP', label: 'RQSP - Nghi ngờ gian lận' }];
        const common = [
            { value: 'RQRN', label: 'RQRN - Yêu cầu hoàn trả' },
            { value: 'RQSP', label: 'RQSP - Nghi ngờ gian lận' },
            { value: 'GDFT', label: 'GDFT - Giao dịch thiện chí' },
        ];
        if (record?.transactionType === 'IBFT') {
            return [
                ...common,
                { value: 'RQNF', label: 'RQNF - Yêu cầu cung cấp chứng từ' },
                { value: 'RQAD', label: 'RQAD - Điều chỉnh thông tin' }
            ];
        }
        return common;
    };

    const showAmount = ['RQRN', 'RQSP', 'GDFT'].includes(form.values.disputeType);
    const showInvestCode = form.values.disputeType === 'RQSP';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            radius="lg"
            size="850px"
            title={<Text fw={700} size="sm" c="dimmed">Yêu cầu tra soát</Text>}
            padding={0}
            styles={{
                header: {
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                    padding: '16px 20px',
                    margin: 0
                },
                body: {
                    // Quan trọng: Cố định chiều cao tối đa của Body để ScrollArea kích hoạt
                    height: 'calc(100vh - 200px)',
                    maxHeight: '750px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0
                },
                content: { overflow: 'hidden' }
            }}
        >
            <ScrollArea scrollbars="y" style={{ flex: 1 }} type="auto">
                <form onSubmit={form.onSubmit((v) => onConfirm?.(record?.seqNo, v))} style={{ padding: '20px' }}>
                    <Stack gap="md">
                        {/* 1. KHỐI THÔNG TIN GIAO DỊCH GỐC (2 CỘT) */}
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <SectionBlock title="Thông tin giao dịch">
                                <InfoRow label="Mã tham chiếu" value={record?.transRef} fw={700} isLong />
                                <InfoRow label="Số lưu vết" value={record?.traceNo} />
                                <InfoRow label="Số tiền gốc" value={Number(record?.amount || 0).toLocaleString() + ' VND'} color="blue.6" fw={700} />
                                <InfoRow label="Loại giao dịch" value={record?.transactionType} />
                                <InfoRow label="Thời gian" value={record?.transDate ? new Date(record.transDate).toLocaleString('vi-VN') : '---'} />
                            </SectionBlock>

                            <SectionBlock title="Đối tác & Trạng thái">
                                <InfoRow label="NH gửi" value={handlers?.getBankName(record?.bankId)} />
                                <InfoRow label="TK gửi" value={record?.fromAccount} />
                                <InfoRow label="NH nhận" value={handlers?.getBankName(record?.benId)} />
                                <InfoRow label="TK nhận" value={record?.toAccount} />
                                <InfoRow label="Trạng thái gốc" value="Thành công" color="green.6" fw={700} />
                            </SectionBlock>
                        </SimpleGrid>

                        {/* 2. KHỐI NHẬP LIỆU CHI TIẾT (MÀU TÍM) */}
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            bg="var(--mantine-color-violet-light)"
                            style={{ borderColor: 'var(--mantine-color-violet-outline)' }}
                        >
                            <Group mb="md" gap="xs">
                                <IconInfoCircle size={18} color="var(--mantine-color-violet-filled)" />
                                <Text fw={700} size="xs" c="violet.7" tt="uppercase">Chi tiết nội dung tra soát</Text>
                            </Group>

                            <Grid gutter="md">
                                <Grid.Col span={showInvestCode ? 6 : 12}>
                                    <Select
                                        label={<Text fw={700} size="xs" mb={4}>Loại tra soát</Text>}
                                        placeholder="Chọn loại tra soát"
                                        data={getInvestigationOptions()}
                                        rightSection={<IconChevronDown size={14} />}
                                        {...form.getInputProps('disputeType')}
                                    />
                                </Grid.Col>

                                {showInvestCode && (
                                    <Grid.Col span={6}>
                                        <Select
                                            label={<Text fw={700} size="xs" mb={4}>Mã phân loại tra soát</Text>}
                                            placeholder="Chọn mã phân loại"
                                            data={[
                                                { value: 'BANK', label: 'BANK - Lỗi ngân hàng' },
                                                { value: 'CUST', label: 'CUST - Khách hàng khiếu nại' },
                                                { value: 'FRAU', label: 'FRAU - Nghi ngờ gian lận' },
                                            ]}
                                            {...form.getInputProps('investigationCode')}
                                        />
                                    </Grid.Col>
                                )}

                                {showAmount && (
                                    <Grid.Col span={12}>
                                        <NumberInput
                                            label={<Text fw={700} size="xs" mb={4}>Số tiền tra soát</Text>}
                                            placeholder="Nhập số tiền"
                                            thousandSeparator=","
                                            leftSection={<IconCash size={16} />}
                                            suffix=" VND"
                                            hideControls
                                            {...form.getInputProps('amount')}
                                        />
                                    </Grid.Col>
                                )}

                                <Grid.Col span={12}>
                                    <Textarea
                                        label={<Text fw={700} size="xs" mb={4}>Nội dung yêu cầu cụ thể</Text>}
                                        placeholder="Nhập nội dung chi tiết để hỗ trợ xử lý nhanh hơn..."
                                        minRows={3}
                                        autosize
                                        {...form.getInputProps('content')}
                                    />
                                </Grid.Col>

                                <Grid.Col span={12}>
                                    <FileInput
                                        label={<Text fw={700} size="xs" mb={4}>Tài liệu minh chứng (nếu có)</Text>}
                                        placeholder="Nhấn để chọn file hoặc kéo thả vào đây"
                                        leftSection={<IconUpload size={16} />}
                                        clearable
                                        {...form.getInputProps('attachment')}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg"
                                        multiple={false}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Divider variant="dashed" color="violet.4" my="xl" opacity={0.4} />

                            <Group justify="flex-end" gap="sm">
                                <Button variant="subtle" color="gray" onClick={onClose} size="sm" radius="xl" fw={700}>
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="submit"
                                    color="violet"
                                    radius="xl"
                                    px={24}
                                    size="sm"
                                    loading={loading}
                                    leftSection={<IconSend size={16} />}
                                >
                                    Xác nhận gửi tra soát
                                </Button>
                            </Group>
                        </Paper>
                    </Stack>
                </form>
            </ScrollArea>
        </Modal>
    );
}