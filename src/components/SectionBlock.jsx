import { Paper, Stack, Text } from "@mantine/core";

export const SectionBlock = ({ title, children }) => (
    <Paper
        withBorder
        p="sm"
        radius="md"
        style={{
            height: '100%',
            backgroundColor: 'var(--mantine-color-body)',
        }}
    >
        <Text fw={700} size="xs" lts="0.5px" mb="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', paddingBottom: '2px' }}>
            {title}
        </Text>
        <Stack gap={0}>{children}</Stack>
    </Paper>
);

// Cách dùng:
// <SectionBlock title="Thông tin giao dịch">
//     <InfoRow label="Số tiền" value={formatMoney(record.amount)} />
//     ...
// </SectionBlock>