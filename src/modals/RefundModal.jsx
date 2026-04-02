import {
    Modal, Button, Textarea, NumberInput, Stack, Group,
    Text, Box, Divider
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { IconSend } from '@tabler/icons-react';

export function RefundModal({ opened, onClose, record, onConfirm, loading }) {
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

    // Format tiền tệ có dấu phẩy ngăn cách phần nghìn
    const formatMoney = (val) => Number(val).toLocaleString() + ' VND';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="md"
            title={<Text fw={600} size="sm" c="dimmed">Hoàn trả giao dịch</Text>}
            styles={{
                content: { borderRadius: '8px' },
                header: { borderBottom: '1px solid #f1f3f5', padding: '16px 20px' },
                body: { padding: '20px 25px' }
            }}
        >
            <Stack gap="xl">
                {/* Thông tin giao dịch gốc - Label to hơn, rõ ràng hơn */}
                <Box>
                    <Stack gap={12}>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Mã tham chiếu</Text>
                            <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>
                                {record?.transRef || '---'}
                            </Text>
                        </Group>

                        <Divider variant="dotted" color="gray.2" />

                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Số tiền gốc</Text>
                            <Text size="sm" fw={700}>{formatMoney(amount)}</Text>
                        </Group>

                        {returnedAmount > 0 && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Đã hoàn trả</Text>
                                <Text size="sm" fw={700}>{formatMoney(returnedAmount)}</Text>
                            </Group>
                        )}

                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Còn lại khả dụng</Text>
                            <Text size="sm" fw={700} c="violet">{formatMoney(remainingAmount)}</Text>
                        </Group>
                    </Stack>
                </Box>

                <form onSubmit={form.onSubmit((v) => onConfirm(record.seqNo, v))}>
                    <Stack gap="lg">
                        <NumberInput
                            label={<Text size="sm" c="dimmed" mb={4}>Số tiền muốn hoàn trả</Text>}
                            placeholder="0"
                            thousandSeparator=","
                            size="sm"
                            radius="sm"
                            hideControls
                            {...form.getInputProps('amount')}
                        />

                        <Textarea
                            label={<Text size="sm" c="dimmed" mb={4}>Lý do hoàn trả</Text>}
                            placeholder="Nhập lý do chi tiết..."
                            minRows={3}
                            size="sm"
                            radius="sm"
                            {...form.getInputProps('reason')}
                        />

                        <Group justify="flex-end" mt="md" gap="sm">
                            <Button variant="subtle" color="gray" onClick={onClose} size="sm">
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                color="violet"
                                radius="xl"
                                loading={loading}
                                px={30}
                                fw={600}
                                leftSection={<IconSend size={18} />}
                            >
                                Xác nhận hoàn tiền
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Modal>
    );
}