import { Box, Text } from "@mantine/core";

export const InfoRow = ({ label, value, color, fw = 500, isLong = false }) => (
    <Box style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', alignItems: 'baseline', marginBottom: '6px' }}>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={fw} c={color} ta="right" style={{ wordBreak: isLong ? 'break-all' : 'normal' }}>
            {value || '---'}
        </Text>
    </Box>
);