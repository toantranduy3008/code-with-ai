import { IconSearch, IconRotateDot, IconMessageDots, IconFileDescription } from '@tabler/icons-react';
import { Badge } from '@mantine/core';

export const SEARCH_CONFIGS = {
    'incoming-payment': {
        title: 'Giao dịch đã nhận',
        apiEndpoint: '/api/v1/payments/incoming',
        extraFilters: [
            { key: 'status', type: 'select', label: 'Trạng thái', data: ['SUCCESS', 'PENDING', 'FAILED'] },
            { key: 'bankCode', type: 'text', label: 'Mã ngân hàng' }
        ],
        columns: [
            { key: 'f11', label: 'Mã GD' },
            { key: 'amount', label: 'Số tiền', isNumber: true },
            { key: 'status', label: 'Trạng thái', render: (v) => <Badge color="green">{v}</Badge> }
        ],
        rowActions: (row, handlers) => [
            { label: 'Hoàn trả', icon: <IconRotateDot size={16} />, color: 'red', onClick: () => handlers.handleRefund(row) }
        ]
    },
    'outgoing-payment': {
        title: 'Giao dịch đã gửi',
        apiEndpoint: '/api/v1/payments/outgoing',
        extraFilters: [
            { key: 'status', type: 'select', label: 'Trạng thái', data: ['SUCCESS', 'PENDING', 'FAILED'] },
            { key: 'bankCode', type: 'text', label: 'Mã ngân hàng' }
        ],
        columns: [
            { key: 'f11', label: 'Mã GD' },
            { key: 'receiver', label: 'Người nhận' },
            { key: 'amount', label: 'Số tiền', isNumber: true }
        ],
        rowActions: (row, handlers) => [
            { label: 'Kiểm tra trạng thái', icon: <IconSearch size={16} />, onClick: () => handlers.handleCheckStatus(row) }
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