import apiClient from '../config/apiClient';
import { FALLBACK_BANKS } from '../config/bankConfig';
import { showToast } from '../config/toast';

export const transactionService = {
    /**
     * Lấy danh sách ngân hàng
     */
    async fetchBanks() {
        try {
            const data = await apiClient.get('/bank');
            if (data && data.listBank) {
                return data.listBank.map(bank => ({
                    value: bank.id,
                    label: `${bank.id} - ${bank.name}`
                }));
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngân hàng:", error);
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Không thể tải danh sách ngân hàng'
            });
            return FALLBACK_BANKS.listBank.map(bank => ({
                value: bank.id,
                label: `${bank.id} - ${bank.name}`
            }));
        }
    },

    /**
     * Kiểm tra thông tin người thụ hưởng (Inquiry)
     */
    async fetchInquiry(creditorAgent, toAccount, toAccountType = 'ACC', fromAccountType = 'ACC') {
        if (!creditorAgent || !toAccount) {
            return null;
        }

        try {
            const response = await apiClient.get('/payment/investigatename', {
                params: {
                    creditorAgent,
                    toAccount,
                    toAccountType,
                    fromAccountType
                }
            });
            return response;
        } catch (error) {
            console.error("Lỗi khi gọi Inquiry API:", error);
            throw error;
        }
    },

    /**
     * Thực hiện chuyển tiền
     */
    async executeTransfer(transferData) {
        const {
            destinationType,    // Số tài khoản nhận
            amount,            // Số tiền
            description,       // Nội dung
            transactionRef     // F63
        } = transferData;

        try {
            const response = await apiClient.post('/payment/fundtransfer', {
                toAccount: destinationType,
                amount: amount,
                content: description,
                f63: transactionRef
            });
            return response;
        } catch (error) {
            console.error("Lỗi chuyển tiền:", error);
            throw error;
        }
    }
};
