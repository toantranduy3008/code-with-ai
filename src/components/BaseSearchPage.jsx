import React, { useEffect, useState } from 'react';
import { Stack, Title, Pagination, Group, Text, Paper, Box, Divider, rem, useMantineTheme } from '@mantine/core';
import { DynamicFilter } from '../components/DynamicFilter';
import { DynamicTable } from '../components/DynamicTable';
import { useSearch } from '../hooks/useSearch';
import { SEARCH_CONFIGS } from '../config/searchConfigs';
import { getTodayRange } from '../helper/dateUtils';

export function BaseSearchPage({ configId, handlers }) {
    const config = SEARCH_CONFIGS[configId];
    const { data, loading, pagination, fetchData } = useSearch(config?.apiEndpoint);

    const [activeFilters, setActiveFilters] = useState(() => {
        const today = getTodayRange();
        return { fromDate: today.start, toDate: today.end, transRef: '', pageSize: 10 };
    });

    useEffect(() => {
        fetchData(activeFilters, 1);
    }, [configId, fetchData]);

    if (!config) return <Text c="red">Cấu hình không hợp lệ</Text>;

    return (
        <Stack
            gap="lg"
            p="md"
            bg="var(--mantine-color-body)"
            style={{ mih: '100vh', borderRadius: rem(8) }}
        >
            {/* Header */}
            <Group justify="space-between" align="flex-start" px="xs">
                <Box>
                    <Title order={2} fw={700} mb={4}>
                        {config.title}
                    </Title>
                    <Text size="xs" c="dimmed">
                        Quản lý và tra cứu dữ liệu hệ thống
                    </Text>
                </Box>
            </Group>
            <Paper
                p="md"
                radius="md"
                withBorder
                // shadow="sm" sẽ giúp tạo độ nổi trong dark mode
                shadow="sm"
            >
                <Text fw={600} size="sm" mb="md">
                    Bộ lọc tìm kiếm
                </Text>
                <Divider mb="xl" variant="dashed" />

                <DynamicFilter
                    initialValues={activeFilters}
                    extraConfigs={config.extraFilters || []}
                    onSearch={(newValues) => {
                        setActiveFilters(newValues);
                        fetchData(newValues, 1);
                    }}
                    loading={loading}
                />
            </Paper>

            {/* Khối Bảng */}
            <Paper radius="md" shadow="sm" withBorder style={{ overflow: 'hidden' }}>
                {/* ✅ SỬA: Dùng nền xám cực nhẹ của hệ thống (tự tối đi ở Dark mode) */}
                <Box p="md" bg="var(--mantine-color-default-hover)">
                    <Text fw={600} size="sm">
                        Danh sách kết quả
                    </Text>
                </Box>

                <DynamicTable
                    data={data}
                    columns={config.columns}
                    rowActions={config.rowActions}
                    handlers={handlers}
                    loading={loading}
                />

                <Divider />
                <Group justify="space-between" p="md">
                    <Text size="sm" c="dimmed">
                        Hiển thị <Text span fw={600} c="var(--mantine-color-text)">{data.length}</Text> / <Text span fw={600} c="var(--mantine-color-text)">{pagination.totalElements || 0}</Text> bản ghi
                    </Text>

                    <Pagination
                        total={pagination.totalPages || 1}
                        value={pagination.activePage}
                        color="violet"
                        onChange={(p) => fetchData(activeFilters, p)}
                        withEdges
                        radius="xl"
                        size="sm"
                    />
                </Group>
            </Paper>
        </Stack>
    );
}