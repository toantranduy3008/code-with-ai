import { Group, TextInput, Select, Button } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
import { getTodayRange } from '../helper/dateUtils';

export function DynamicFilter({ extraConfigs = [], onSearch, loading }) {
    const inputProps = {
        variant: "filled", // Nền xám nhạt, nhìn rất hiện đại
        size: "sm",
        labelProps: { mb: 5, fw: 500, size: 'xs', c: 'gray.7' }
    };
    const today = getTodayRange();

    // Khởi tạo state giống hệt bên ngoài để đồng bộ
    const [filters, setFilters] = useState({
        fromDate: today.start,
        toDate: today.end,
        transRef: '',
        pageSize: 10
    });

    const updateField = (key, value) => {
        if ((key === 'fromDate' || key === 'toDate') && !value) return; // Chặn xóa ngày
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Group align="flex-end" mb="xl">
            <DateTimePicker
                {...inputProps}
                label="Từ ngày"
                value={filters.fromDate}
                clearable={false}
                variant="filled"
                labelProps={{ mb: 5, fw: 500, size: 'xs' }}
                onChange={(v) => updateField('fromDate', v)}
            />
            <DateTimePicker
                {...inputProps}
                label="Đến ngày"
                value={filters.toDate}
                clearable={false}
                onChange={(v) => updateField('toDate', v)}
                variant="filled"
                labelProps={{ mb: 5, fw: 500, size: 'xs' }}
            />
            <TextInput
                {...inputProps}
                label="F63"
                value={filters.transRef}
                onChange={(e) => updateField('transRef', e.target.value)}
            />

            {extraConfigs.map(cfg => (
                cfg.type === 'select'
                    ? <Select {...inputProps} key={cfg.key} label={cfg.label} data={cfg.data} clearable onChange={(v) => updateField(cfg.key, v)} />
                    : <TextInput {...inputProps} key={cfg.key} label={cfg.label} onChange={(e) => updateField(cfg.key, e.target.value)} />
            ))}

            <Select {...inputProps} label="Dòng/Trang" w={90} data={['10', '20', '50']} value={String(filters.pageSize)} onChange={(v) => updateField('pageSize', Number(v))} />
            <Button onClick={() => onSearch(filters)} loading={loading} color="violet">Tìm kiếm</Button>
        </Group>
    );
}