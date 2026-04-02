import {
    Modal, Button, TextInput, NumberInput, Stack, Group,
    Text, Box, Select, Textarea, FileInput, Divider,
    ScrollArea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import {
    IconHash,
    IconCash, IconUpload, IconChevronDown,
    IconSend
} from '@tabler/icons-react';

export function DisputeModal({ opened, onClose, record, onConfirm, loading, type = "TCPL" }) {
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
            content: (value) => (value.length < 5 ? 'Nội dung quá ngắn' : null),
        },
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (opened) form.reset();
        if (opened && record) {
            form.initialize({
                disputeType: '',
                content: '',
                amount: record.amount || 0,
                investigationCode: '',
                attachment: null,
            });
        }
    }, [opened, record]);

    // Logic 1: Danh sách Loại tra soát dựa trên transactionType
    const getInvestigationOptions = () => {
        if (type === "TCNL") {
            return [
                { value: 'RQSP', label: 'RQSP - Nghi ngờ gian lận' },
            ];
        }
        const common = [
            { value: 'RQRN', label: 'RQRN - Yêu cầu hoàn trả' },
            { value: 'RQSP', label: 'RQSP - Nghi ngờ gian lận' },
            { value: 'GDFT', label: 'GDFT - Giao dịch thiện chí' },
        ];

        if (record?.transactionType === 'IBFT') {
            return [
                ...common,
                { value: 'RQNF', label: 'RQNF - Yêu cầu cung cấp chứng từ' },
                { value: 'RQAD', label: 'RQAD - Điều chỉnh thông tin' },
            ];
        }
        return common;
    };

    // Logic 2: Hiển thị Số tiền tra soát (RQRN, RQSP, GDFT)
    const showAmount = ['RQRN', 'RQSP', 'GDFT'].includes(form.values.disputeType);

    // Logic 3: Hiển thị Mã tra soát (RQSP)
    const showInvestCode = form.values.disputeType === 'RQSP';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            radius={20}
            size="md"
            padding={24}
            title={<Text fw={600} size="sm" c="dimmed">Yêu cầu tra soát</Text>}
            scrollAreaComponent={ScrollArea.Autosize}
            styles={{
                content: { borderRadius: '12px' },
                header: { borderBottom: '1px solid #f1f3f5', marginBottom: '10px', padding: '12px 20px' },
                body: { padding: '15px 25px' }
            }}
        >
            <Box
                mb={20}
                p={12}
                style={{
                    backgroundColor: 'var(--mantine-color-indigo-light)',
                    borderRadius: 12,
                    border: '1px solid var(--mantine-color-indigo-light-border)',
                }}
            >
                <Group gap="xs">
                    <IconHash size={16} color="var(--mantine-color-indigo-filled)" stroke={2.5} />
                    <Text size="xs" fw={500} c="indigo">Mã tham chiếu:</Text>
                    <Text fw={700} size="sm" style={{ fontFamily: 'monospace' }} c="indigo">
                        {record?.transRef || '---'}
                    </Text>
                    <Text size="xs" fw={700} c="indigo.7" bg="white" px={8} py={2} style={{ borderRadius: 6 }}>
                        {record?.transactionType}
                    </Text>
                </Group>
            </Box>


            <form onSubmit={form.onSubmit((v) => onConfirm?.(record.seqNo, v))}>
                <Stack gap="md">
                    {/* Loại tra soát */}
                    <Select
                        label={<Text fw={700} size="sm" mb={4}>Loại tra soát</Text>}
                        placeholder="Chọn loại tra soát"
                        data={getInvestigationOptions()}
                        rightSection={<IconChevronDown size={16} />}
                        searchable
                        {...form.getInputProps('disputeType')}
                    />

                    {/* Mã tra soát - Chỉ hiện khi là RQSP */}
                    {showInvestCode && (
                        <Select
                            label={<Text fw={700} size="sm" mb={4}>Mã tra soát</Text>}
                            placeholder="Chọn mã phân loại"
                            data={[
                                { value: 'BANK', label: 'BANK - Lỗi ngân hàng' },
                                { value: 'CUST', label: 'CUST - Khách hàng khiếu nại' },
                                { value: 'FRAU', label: 'FRAU - Nghi ngờ gian lận' },
                            ]}
                            {...form.getInputProps('investigationCode')}
                        />
                    )}

                    {/* Số tiền tra soát - Chỉ hiện cho RQRN, RQSP, GDFT */}
                    {showAmount && (
                        <NumberInput
                            label={<Text fw={700} size="sm" mb={4}>Số tiền tra soát</Text>}
                            placeholder="Nhập số tiền"
                            thousandSeparator=","
                            hideControls
                            leftSection={<IconCash size={18} />}
                            {...form.getInputProps('amount')}
                        />
                    )}

                    {/* Nội dung tra soát */}
                    <Textarea
                        label={<Text fw={700} size="sm" mb={4}>Nội dung tra soát</Text>}
                        placeholder="Nhập chi tiết yêu cầu..."
                        minRows={3}
                        {...form.getInputProps('content')}
                    />

                    {/* File đính kèm */}
                    <FileInput
                        label={<Text fw={700} size="sm" mb={4}>File đính kèm (nếu có)</Text>}
                        placeholder="Chọn file minh chứng"
                        leftSection={<IconUpload size={18} />}
                        clearable
                        {...form.getInputProps('attachment')}
                    />

                    <Divider variant="dashed" my={10} />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="subtle" color="gray" onClick={onClose} radius="xl" fw={700}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            color="violet"
                            radius="xl"
                            px={30}
                            fw={600}
                            loading={loading}
                            leftSection={<IconSend size={18} />}
                        >
                            Gửi tra soát
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}