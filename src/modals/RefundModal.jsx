import {
    Modal, Button, Textarea, NumberInput, Stack, Group,
    Text, Box, Divider, Paper, Grid, ScrollArea,
    SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { IconSend, IconCurrencyDollar, IconFileText } from '@tabler/icons-react';

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
// Tái sử dụng InfoRow chuẩn từ DisputeModal để đảm bảo đồng bộ thiết kế
const InfoRow = ({ label, value, color, fw = 500, isLong = false }) => (
    <Box style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', alignItems: 'baseline', marginBottom: '6px' }}>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={fw} color={color} ta="right" style={{ wordBreak: isLong ? 'break-all' : 'normal' }}>
            {value || '---'}
        </Text>
    </Box>
);

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

export function RefundModal({ opened, onClose, record, onConfirm, loading, handlers }) {
    console.log('RefundModal record:', record); // Debug log để kiểm tra dữ liệu truyền vào
    const amount = record?.amount || 0;
    const returnedAmount = record?.returnedAmount || 0;
    const remainingAmount = amount - returnedAmount;

    const form = useForm({
        initialValues: { amount: 0, reason: '' },
        validate: {
            amount: (value) => {
                if (value <= 0) return 'Số tiền phải lớn hơn 0';
                if (value > remainingAmount) return `Tối đa: ${remainingAmount.toLocaleString()} VND`;
                return null;
            },
            reason: (value) => (value.trim().length < 5 ? 'Vui lòng nhập lý do cụ thể' : null),
        },
    });

    useEffect(() => {
        if (opened && record) {
            form.reset();
            form.setFieldValue('amount', remainingAmount);
        }
    }, [opened, record, remainingAmount]);

    const formatMoney = (val) => Number(val).toLocaleString() + ' VND';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            radius={20}
            size="850px" // Mở rộng kích thước tương đương DisputeModal
            padding={0}
            title={<Text fw={600} size="sm" c="dimmed">Hoàn trả giao dịch</Text>}
            styles={{
                content: { borderRadius: '12px', overflow: 'hidden' },
                header: { borderBottom: '1px solid var(--mantine-color-default-border)', margin: 0, padding: '12px 20px' },
                body: { padding: 0 }
            }}
        >
            <form onSubmit={form.onSubmit((v) => onConfirm(record?.seqNo, v))}>
                <ScrollArea.Autosize mah="calc(100vh - 120px)" mx="auto" p="md">
                    <Stack gap="sm">
                        {/* Chia 2 cột thông tin để Modal rộng và chuyên nghiệp hơn */}
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                            <SectionBlock title="Thông tin hoàn trả">
                                <InfoRow label="Số tiền gốc" value={formatMoney(amount)} />
                                <InfoRow label="Đã hoàn trả" value={formatMoney(returnedAmount)} />
                                <Divider my={8} variant="dashed" />
                                <InfoRow label="Còn lại" value={formatMoney(remainingAmount)} color="violet.4" fw={700} />
                            </SectionBlock>

                            <SectionBlock title="Thông tin giao dịch gốc">
                                <InfoRow label="Mã tham chiếu" value={record?.transRef} isLong />
                                <InfoRow label="Số lưu vết" value={record?.traceNo || '---'} />
                                <InfoRow label="Loại giao dịch" value={MAPPER.transactionType[record.transactionType]} />
                                <InfoRow label="Thời gian giao dịch" value={new Date(record.transDate).toLocaleString('vi-VN')} />
                                <InfoRow label="NH gửi" value={handlers?.getBankName(record.bankId)} />
                                <InfoRow label="TK gửi" value={record.fromAccount} />
                                <InfoRow label="NH nhận" value={handlers?.getBankName(record.benId)} />
                                <InfoRow label="TK nhận" value={record.toAccount} />
                            </SectionBlock>
                        </SimpleGrid>

                        {/* Phần nhập liệu với màu nền Adaptive */}
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            style={{
                                backgroundColor: 'var(--mantine-color-violet-light)',
                                borderColor: 'var(--mantine-color-violet-outline-hover)'
                            }}
                        >
                            <Text fw={700} size="xs" c="blue.4" tt="uppercase" mb="md">Thông tin hoàn trả</Text>
                            <Stack gap="sm">
                                <Grid gutter="md">
                                    <Grid.Col span={4}>
                                        <NumberInput
                                            label={<Text fw={700} size="xs" mb={4}>Số tiền hoàn trả</Text>}
                                            placeholder="0"
                                            thousandSeparator=","
                                            leftSection={<IconCurrencyDollar size={16} />}
                                            suffix=" VND"
                                            hideControls
                                            {...form.getInputProps('amount')}
                                            size="sm"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={8}>
                                        <Textarea
                                            label={<Text fw={700} size="xs" mb={4}>Lý do chi tiết</Text>}
                                            placeholder="Nhập lý do hoàn trả cho khách hàng..."
                                            minRows={1}
                                            autosize
                                            {...form.getInputProps('reason')}
                                            size="sm"
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Divider variant="dashed" color="violet.4" my={5} opacity={0.3} />

                                <Group justify="flex-end" gap="sm">
                                    <Button variant="subtle" color="gray" onClick={onClose} radius="xl" fw={700} size="sm">
                                        Hủy bỏ
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
                                        Xác nhận hoàn tiền
                                    </Button>
                                </Group>
                            </Stack>
                        </Paper>
                    </Stack>
                </ScrollArea.Autosize>
            </form>
        </Modal>
    );
}