import {
    Stack,
    Paper,
    SimpleGrid,
    Select,
    TextInput,
    Group,
    Button,
    NumberInput,
    Text,
    Divider,
    Loader
} from '@mantine/core';
import {
    IconWallet,
    IconArrowRightCircle,
    IconBuildingBank,
    IconSearch,
    IconQrcode,
    IconSend,
    IconShieldCheck,
    IconCheck
} from '@tabler/icons-react';

export const TransactionForm = ({
    formData,
    banks,
    fetchingBanks,
    inquiryLoading,
    qrType,
    loading,
    onFieldChange,
    onQRClick,
    onTransferClick,
    onInquiryBlur
}) => {
    const handleSourceFromChange = (val) => {
        onFieldChange('sourceFrom', val || '');
    };

    const handleSourceToChange = (val) => {
        onFieldChange('sourceTo', val || '');
    };

    const handleDestinationBankChange = (val) => {
        onFieldChange('destinationBank', val || '');
    };

    const handleDestinationTypeChange = (e) => {
        onFieldChange('destinationType', e.target.value);
    };

    const handleAmountChange = (val) => {
        onFieldChange('amount', val);
    };

    const handleDescriptionChange = (e) => {
        onFieldChange('description', e.target.value);
    };

    return (
        <Paper withBorder shadow="md" p="xl" radius="lg">
            <Stack gap="md">
                <SimpleGrid cols={2} spacing="md">
                    <Stack gap={4}>
                        <Select
                            label="Từ nguồn"
                            placeholder="Chọn nguồn tiền"
                            data={[
                                { value: 'ACC', label: 'Tài khoản' },
                                { value: 'PAN', label: 'Thẻ' },
                            ]}
                            value={formData.sourceFrom || ''}
                            onChange={handleSourceFromChange}
                            radius="md"
                            size="md"
                            leftSection={<IconWallet size={18} stroke={1.5} color="var(--mantine-color-violet-filled)" />}
                        />
                    </Stack>

                    <Select
                        label="Đến nguồn"
                        placeholder="Chọn đích đến"
                        data={[
                            { value: 'ACC', label: 'Tài khoản' },
                            { value: 'PAN', label: 'Thẻ' },
                        ]}
                        value={formData.sourceTo || ''}
                        onChange={handleSourceToChange}
                        radius="md"
                        size="md"
                        leftSection={<IconArrowRightCircle size={18} stroke={1.5} color="var(--mantine-color-gray-6)" />}
                    />
                </SimpleGrid>

                <Stack gap={6}>
                    <Select
                        label="Ngân hàng nhận"
                        placeholder={fetchingBanks ? "Đang tải danh sách..." : "Chọn ngân hàng nhận"}
                        data={banks}
                        rightSection={fetchingBanks ? <Loader size="xs" /> : null}
                        disabled={fetchingBanks}
                        value={formData.destinationBank || ''}
                        onChange={handleDestinationBankChange}
                        radius="md"
                        size="md"
                        searchable
                        leftSection={<IconBuildingBank size={18} color="var(--mantine-color-violet-filled)" />}
                    />
                </Stack>

                <TextInput
                    label="Số tài khoản/ Thẻ nhận"
                    placeholder="Nhập hoặc quét mã QR"
                    required
                    leftSection={<IconSearch size={18} />}
                    rightSection={inquiryLoading ? <Loader size="xs" /> : null}
                    value={formData.destinationType || ''}
                    onChange={handleDestinationTypeChange}
                    radius="md"
                    size="md"
                    disabled={qrType === 'dynamic'}
                    onBlur={onInquiryBlur}
                />

                <Stack gap={4}>
                    <TextInput
                        label="Tên người thụ hưởng"
                        value={formData.beneficiaryName || ''}
                        readOnly
                        placeholder="Tên người thụ hưởng"
                        radius="md"
                        size="md"
                        variant="filled"
                        leftSection={<IconShieldCheck size={18} color={formData.beneficiaryName ? "green" : "gray"} />}
                        styles={() => ({
                            input: {
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                backgroundColor: 'var(--mantine-color-violet-light)',
                                color: 'var(--mantine-color-violet-filled)',
                                border: '1px solid var(--mantine-color-violet-light-hover)',
                            },
                        })}
                    />
                    {formData.beneficiaryName && (
                        <Group gap={4} pl={5}>
                            <Text size="xs" c="green.8" fw={500}>✓ Đã xác thực qua Napas</Text>
                        </Group>
                    )}
                </Stack>

                {formData.beneficiaryName && (
                    <Stack gap={4}>
                        <TextInput
                            label="Mã tham chiếu | F63"
                            placeholder="F63"
                            rightSection={inquiryLoading ? <Loader size="xs" /> : null}
                            value={formData.f63 || ''}
                            radius="md"
                            size="md"
                            disabled
                        />
                    </Stack>
                )}

                <Stack gap={8}>
                    <NumberInput
                        label="Số tiền"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        thousandSeparator=","
                        suffix=" VND"
                        hideControls
                        radius="md"
                        size="md"
                        allowNegative={false}
                        styles={{
                            input: {
                                fontWeight: 700,
                                color: 'var(--mantine-color-violet-filled)',
                                fontSize: '1.1rem'
                            }
                        }}
                    // disabled={qrType === 'dynamic'}
                    />
                </Stack>

                <TextInput
                    label="Nội dung"
                    placeholder="Nội dung"
                    value={formData.description || ''}
                    onChange={handleDescriptionChange}
                    radius="md"
                    size="md"
                // disabled={qrType === 'dynamic'}
                />

                <Divider my="sm" />

                <Group grow>
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<IconQrcode size={18} />}
                        onClick={onQRClick}
                        radius="md"
                        size="md"
                    >
                        Quét QR
                    </Button>
                    <Button
                        color="violet"
                        loading={loading}
                        onClick={onTransferClick}
                        radius="md"
                        size="md"
                        leftSection={<IconSend size={18} />}
                        disabled={!formData.beneficiaryName || inquiryLoading}
                        style={{
                            boxShadow: formData.beneficiaryName ? '0 8px 15px rgba(103, 65, 217, 0.3)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Xác nhận chuyển tiền
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};
