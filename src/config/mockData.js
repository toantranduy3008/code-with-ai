// src/config/mockData.js
export const MOCK_API_RESPONSES = {
    '/api/v1/payments/incoming': {
        content: [
            { f11: '100001', amount: 500000, status: 'SUCCESS', f63: 'NAPAS_QR_01' },
            { f11: '100002', amount: 1200000, status: 'PENDING', f63: 'VIETQR_02' },
            { f11: '100003', amount: 850000, status: 'FAILED', f63: 'VNPAY_01' },
        ],
        totalPages: 5,
        totalElements: 15,
        size: 10,
        number: 0, // Trang hiện tại (0-based)
        first: true,
        last: false
    },
    '/api/v1/payments/outgoing': {
        content: [
            { f11: '900001', receiver: 'NGUYEN VAN A', amount: 250000, f63: 'MB_BANK' },
            { f11: '900002', receiver: 'TRAN THI B', amount: 3000000, f63: 'VCB' }
        ],
        totalPages: 2,
        totalElements: 20,
        size: 10,
        number: 0
    },
    '/api/v1/disputes/incoming': {
        content: [
            { disputeId: 'DS-001', f63: 'NAPAS_QR_01', reason: 'Giao dịch trùng', status: 'OPEN' },
            { disputeId: 'DS-002', f63: 'VIETQR_02', reason: 'Sai số tiền', status: 'PENDING' }
        ],
        totalPages: 1,
        totalElements: 2,
        size: 10,
        number: 0
    },
    '/api/v1/logs/transactions': {
        content: [
            { timestamp: '2026-03-28 22:00:01', action: 'INIT_PAYMENT', f63: 'TX_999' },
            { timestamp: '2026-03-28 22:01:45', action: 'VERIFY_OTP', f63: 'TX_999' },
            { timestamp: '2026-03-28 22:02:10', action: 'SUCCESS', f63: 'TX_999' }
        ],
        totalPages: 10,
        totalElements: 100,
        size: 10,
        number: 0
    }
};