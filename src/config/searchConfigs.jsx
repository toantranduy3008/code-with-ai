import { IconSearch, IconRotateDot, IconMessageDots, IconFileDescription } from '@tabler/icons-react';
import { Badge } from '@mantine/core';

export const SEARCH_CONFIGS = {
    'incoming-payment': {
        title: 'Giao dịch đã nhận',
        apiEndpoint: '/payment/listIncomingTrans',
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
            { label: 'Hoàn trả', icon: <IconRotateDot size={16} />, color: 'red', onClick: () => handlers.handleRefund(row) },
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