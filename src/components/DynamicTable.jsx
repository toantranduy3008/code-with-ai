import { Table, ScrollArea, Box, Text, Center, Loader } from '@mantine/core';
import { RowActionMenu } from './RowActionMenu';

// DynamicTable.jsx
export function DynamicTable({ data, columns, rowActions, handlers, loading }) {
    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}>
                    <Table.Tr>
                        {columns.map((col) => (
                            <Table.Th key={col.key} style={{ color: 'var(--mantine-color-text)' }}>
                                {col.label}
                            </Table.Th>
                        ))}
                        {rowActions && <Table.Th style={{ color: 'var(--mantine-color-text)' }}>Thao tác</Table.Th>}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {data.map((row, i) => {
                        const actionsForThisRow = typeof rowActions === 'function'
                            ? rowActions(row, handlers)
                            : [];

                        return (
                            <Table.Tr key={i}>
                                {columns.map((col) => (
                                    <Table.Td key={col.key}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </Table.Td>
                                ))}

                                {rowActions && (
                                    <Table.Td>
                                        {/* Truyền mảng đã thực thi vào đây */}
                                        <RowActionMenu
                                            row={row}
                                            actions={actionsForThisRow}
                                        />
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}