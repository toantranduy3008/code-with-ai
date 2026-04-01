import { IconSearch, IconRotateDot, IconMessageDots, IconFileDescription, IconMoneybagMove, IconDetails } from '@tabler/icons-react';
import { Badge, Text } from '@mantine/core';

export const SEARCH_CONFIGS = {
    'incoming-payment': {
        title: 'Giao dịch đã nhận',
        apiEndpoint: '/payment/listIncomingTrans',
        extraFilters: [
            // { key: 'status', type: 'select', label: 'Trạng thái', data: ['SUCCESS', 'PENDING', 'FAILED'] },
            // { key: 'bankCode', type: 'text', label: 'Mã ngân hàng' }
        ],
        columns: [
            {
                key: 'stt',
                label: 'STT',
                // Dùng tham số thứ 2 của render là index trong mảng data
                render: (_, __, index) => <Text size="sm" fw={500}>{index + 1}</Text>,
            },
            { key: 'traceNo', label: 'Số lưu vết' },
            { key: 'transRef', label: 'Mã tham chiếu' },
            {
                key: 'amount',
                label: 'Số tiền',
                render: (value) => (
                    <Text>
                        {value > 0 ? new Intl.NumberFormat('en-US').format(value) : '0'}
                    </Text>
                ),
            },
            {
                key: 'returnedAmount',
                label: 'Số tiền đã hoàn trả',
                render: (value) => (
                    <Text>
                        {value > 0 ? new Intl.NumberFormat('en-US').format(value) : '0'}
                    </Text>
                ),
            },
            {
                key: 'transactionType',
                label: 'Loại giao dịch',
                render: (value) => (
                    <Text >
                        {value === 'IBFT' ? 'Chuyển tiền' : 'Thanh toán'}
                    </Text>
                )
            },
            {
                key: 'settlementStatus',
                label: 'Trạng thái quyết toán',
                render: (value) => (
                    <Badge variant="light" color={value === 'ACSP' ? 'green' : 'gray'}>
                        {value}
                    </Badge>
                )
            },
            {
                key: 'bankId',
                label: 'Ngân hàng phát lệnh',
                render: (value, row, i, h) => (
                    <Text size="sm">{h?.getBankName?.(value) || value}</Text>
                )
            },
            {
                key: 'benId',
                label: 'Ngân hàng thụ hưởng',
                render: (value, row, i, h) => (
                    <Text size="sm">{h?.getBankName?.(value) || value}</Text>
                )
            },
        ],
        rowActions: (row, handlers) => [
            { label: 'Hoàn trả', icon: <IconRotateDot size={16} />, color: 'red', onClick: () => handlers?.handleRefund(row) },
            { label: 'Tạo tra soát', icon: <IconMoneybagMove size={16} />, color: 'red', onClick: () => handlers?.handleCreateDispute(row) },
            { label: 'Chi tiết giao dịch', icon: <IconDetails size={16} />, color: 'red', onClick: () => handlers?.handleViewDetails(row) },
        ]
    },
    'outgoing-payment': {
        title: 'Giao dịch đã gửi',
        apiEndpoint: '/payment/listTrans',
        extraFilters: [
            { key: 'status', type: 'select', label: 'Trạng thái', data: ['SUCCESS', 'PENDING', 'FAILED'] },
            { key: 'bankCode', type: 'text', label: 'Mã ngân hàng' }
        ],
        columns: [
            { key: 'traceNo', label: 'Số lưu vết' },
            { key: 'transRef', label: 'Mã tham chiếu' },
            { key: 'amount', label: 'Số tiền', isNumber: true },
            { key: 'transactionType', label: 'Loại giao dịch' },
            { key: 'settlementStatus', label: 'Trạng thái quyết toán' },
            { key: 'bankId', label: 'Ngân hàng phát lệnh' },
            { key: 'benId', label: 'Ngân hàng Thụ hưởng' },
        ],
        rowActions: (row, handlers) => [
            { label: 'Kiểm tra trạng thái', icon: <IconSearch size={16} />, onClick: () => handlers.handleCheckStatus(row) },
            { label: 'Tạo tra soát', icon: <IconSearch size={16} />, onClick: () => handlers.handleCreateDispute(row) },
        ]
    },
    'incoming-dispute': {
        title: 'Tra soát đã nhận',
        apiEndpoint: '/api/v1/disputes/incoming',
        extraFilters: [],
        columns: [
            { key: 'disputeId', label: 'Mã Tra soát' },
            { key: 'f63', label: 'Mã F63' },
            { key: 'reason', label: 'Lý do' }
        ],
        rowActions: (row, handlers) => [
            { label: 'Trả lời', icon: <IconMessageDots size={16} />, onClick: () => handlers.handleReply(row) }
        ]
    },
    'outgoing-dispute': {
        title: 'Tra soát đã gửi',
        apiEndpoint: '/api/v1/disputes/outgoing',
        extraFilters: [],
        columns: [
            { key: 'disputeId', label: 'Mã Tra soát' },
            { key: 'status', label: 'Trạng thái' }
        ]
    },
    'transaction-logs': {
        title: 'Tra cứu log giao dịch',
        apiEndpoint: '/api/v1/logs/transactions',
        columns: [
            { key: 'timestamp', label: 'Thời gian' },
            { key: 'f63', label: 'Mã F63' },
            { key: 'action', label: 'Hành động' }
        ]
    }
};