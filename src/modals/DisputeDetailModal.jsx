import React, { useEffect } from 'react';
import {
    Modal, Text, Divider, Stack, Group, Badge, ScrollArea,
    SimpleGrid, Box, Paper, Select, Button, Textarea, FileInput, Grid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend, IconPaperclip, IconChevronDown } from '@tabler/icons-react';

const STATUS_MAPPER = {
    OPEN: { label: 'OPEN - Mở', color: 'blue' },
    RJCT: { label: 'RJCT - Từ chối', color: 'red' },
    PRCD: { label: 'PRCD - Đồng ý', color: 'green' },
    EXRJ: { label: 'EXRJ - Từ chối', color: 'red' },
    EXPR: { label: 'EXPR - Đồng ý', color: 'green' },
    EXPI: { label: 'EXPI - Chờ phản hồi', color: 'orange' },
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return '---';
    try {
        const date = new Date(dateStr);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
        console.error("Lỗi định dạng ngày:", e);
        return dateStr;
    }
};

// Cải thiện InfoRow để hiển thị text sáng hơn trong Dark Mode
const InfoRow = ({ label, value, color, fw = 500, isLong = false }) => (
    <Box style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px', alignItems: 'baseline', marginBottom: '4px' }}>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={fw} color={color} ta="right" style={{ wordBreak: isLong ? 'break-all' : 'normal' }}>
            {value || '---'}
        </Text>
    </Box>
);

// SectionBlock sử dụng màu nền động (Adaptive Background)
const SectionBlock = ({ title, children }) => (
    <Paper
        withBorder
        p="sm"
        radius="md"
        style={{
            height: '100%',
            backgroundColor: 'var(--mantine-color-body)', // Tự đổi theo theme
        }}
    >
        <Text fw={700} size="xs" c="blue.5" tt="uppercase" lts="0.5px" mb="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', paddingBottom: '2px' }}>
            {title}
        </Text>
        <Stack gap={0}>{children}</Stack>
    </Paper>
);

export default function DisputeDetailModal({ opened, onClose, record, onConfirm, loading, handlers, type = 'INCOMING' }) {
    const form = useForm({
        initialValues: { responseStatus: '', reason: '', file: null },
        validate: {
            responseStatus: (value) => (!value ? 'Chọn trạng thái' : null),
            reason: (value) => (!value || value.trim().length < 5 ? 'Nội dung quá ngắn' : null),
        },
    });

    useEffect(() => { form.reset(); }, [opened]);

    if (!record) return null;

    const statusConfig = STATUS_MAPPER[record.disputeStatus] || { label: record.disputeStatus, color: 'gray' };
    const formatVND = (val) => (val ? Number(val).toLocaleString() : '0');

    const options = (record.disputeStatus === 'OPEN')
        ? [{ value: 'PRCD', label: 'PRCD - Đồng ý' }, { value: 'RJCT', label: 'RJCT - Từ chối' }]
        : (record.disputeStatus === 'EXPI')
            ? [{ value: 'EXPR', label: 'EXPR - Đồng ý' }, { value: 'EXRJ', label: 'EXRJ - Từ chối' }]
            : [];

    return (
        <Modal
            opened={opened} onClose={onClose} centered radius={20} size="850px" padding={0}
            title={<Text fw={600} size="sm" c="dimmed">Chi tiết tra soát</Text>}
            styles={{
                content: { borderRadius: '12px', overflow: 'hidden' },
                header: {
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                    margin: 0,
                    padding: '12px 20px'
                },
                body: { padding: 0 }
            }}
        >
            <form onSubmit={form.onSubmit((values) => onConfirm?.({
                id: record.id,
                disputeStatus: values.responseStatus,
                disputeMessage: values.reason,
                fileAttachment: values.file
            }))}>
                <ScrollArea.Autosize mah="calc(100vh - 120px)" mx="auto" p="md">
                    <Stack gap="sm">
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                            <SectionBlock title="Thông tin tra soát">
                                <InfoRow label="Số tiền tra soát" value={`${formatVND(record.disputeAmount)} VND`} color="violet.4" fw={700} />
                                <Box style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                                    <Text size="xs" c="dimmed">Trạng thái</Text>
                                    <Group justify="flex-end">
                                        <Badge variant="light" color={statusConfig.color} size="xs" radius="xl" h={20}>{statusConfig.label}</Badge>
                                    </Group>
                                </Box>
                                <Divider my={6} variant="dashed" />
                                <InfoRow label="Mã tra soát" value={record.disputeId} isLong />
                                <InfoRow label="Loại tra soát" value={record.disputeType} />
                                <InfoRow label="Thời gian tạo" value={formatDateTime(record.disputeCreationDateTime)} />
                                <InfoRow label="Bên yêu cầu" value={handlers.getBankName(record.disputeAssigner)} />
                                <InfoRow label="Bên tiếp nhận" value={handlers.getBankName(record.disputeAssignee)} />
                            </SectionBlock>

                            <SectionBlock title="Thông tin giao dịch gốc">
                                <InfoRow label="Mã tham chiếu" value={record.origTransactionReference} isLong />
                                <InfoRow label="Số lưu vết" value={record.origSystemTrace} />
                                <InfoRow label="Số tiền gốc" value={`${formatVND(record.origTransactionAmount)} VND`} fw={600} />
                                <Divider my={6} variant="dashed" />
                                <InfoRow label="Ngân hàng gửi" value={handlers.getBankName(record.origSendingMember)} />
                                <InfoRow label="Tài khoản gửi" value={record.origSenderAcc} />
                                <InfoRow label="Ngân hàng nhận" value={handlers.getBankName(record.origReceivingMember)} />
                                <InfoRow label="Tài khoản nhận" value={record.origReceiverAcc} />
                            </SectionBlock>
                        </SimpleGrid>

                        {/* PHẦN PHẢN HỒI: FILE ĐÍNH KÈM Ở DƯỚI CÙNG & TƯƠNG THÍCH DARKMODE */}
                        {options.length > 0 && type === 'INCOMING' && (
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                                style={{
                                    backgroundColor: 'var(--mantine-color-violet-light)', // Nhạt ở Light, dịu ở Dark
                                    borderColor: 'var(--mantine-color-violet-outline-hover)'
                                }}
                            >
                                <Text fw={700} size="xs" c="violet.5" tt="uppercase" mb="md">Phản hồi tra soát</Text>
                                <Stack gap="sm">
                                    <Grid gutter="md">
                                        {/* Hàng 1: Trạng thái & Ghi chú */}
                                        <Grid.Col span={4}>
                                            <Select
                                                label={<Text fw={700} size="xs" mb={4}>Trạng thái trả lời</Text>}
                                                placeholder="Chọn..."
                                                data={options}
                                                rightSection={<IconChevronDown size={14} />}
                                                {...form.getInputProps('responseStatus')}
                                                size="sm"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={8}>
                                            <Textarea
                                                label={<Text fw={700} size="xs" mb={4}>Nội dung</Text>}
                                                placeholder="Nhập nội dung phản hồi chi tiết..."
                                                minRows={1}
                                                autosize
                                                {...form.getInputProps('reason')}
                                                size="sm"
                                            />
                                        </Grid.Col>

                                        {/* Hàng 2: File đính kèm để sau cùng (Chiếm 6/12 để tránh quá rộng) */}
                                        <Grid.Col span={6}>
                                            <FileInput
                                                label={<Text fw={700} size="xs" mb={4}>Tài liệu đính kèm (nếu có)</Text>}
                                                placeholder="Chọn file minh chứng..."
                                                leftSection={<IconPaperclip size={16} />}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg"
                                                clearable
                                                {...form.getInputProps('file')}
                                                size="sm"
                                                multiple={false}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Divider variant="dashed" color="violet.4" my={5} opacity={0.3} />

                                    <Group justify="flex-end" gap="sm">
                                        <Button variant="subtle" color="gray" onClick={onClose} radius="xl" fw={700} size="sm">
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="violet"
                                            radius="xl"
                                            px={30}
                                            fw={600}
                                            size="sm"
                                            loading={loading}
                                            leftSection={<IconSend size={16} />}
                                        >
                                            Xác nhận gửi phản hồi
                                        </Button>
                                    </Group>
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </ScrollArea.Autosize>
            </form>
        </Modal>
    );
}