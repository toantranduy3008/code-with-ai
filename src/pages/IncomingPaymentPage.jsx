import { BaseSearchPage } from "../components/BaseSearchPage";
import { RefundModal } from "../modals/RefundModal";
import { useRef, useState } from "react";
import apiClient from "../config/apiClient";
import { showToast } from "../config/toast";
import { useBankList } from "../hooks/useBankList";
import { DisputeModal } from "../modals/DisputeModal";
import { generateFileAttachment } from "../helper/fileUtils";
import PaymentDetailModal from "../modals/PaymentDetailModal";
export default function IncomingPaymentPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const searchPageRef = useRef();
    const { banks } = useBankList();
    const MAPPER = {
        toAccountType: { ACC: 'Số tài khoản', PAN: 'Số thẻ' },
        f60: {
            '01': 'ATM',
            '04': 'Internet Banking',
            '05': 'Mobile Banking',
            '06': 'SMS Banking',
            '99': 'Thanh toán QR'
        },
        status: { RJCT: 'RJCT-Từ chối', ACSP: 'ACSP-Quyết toán' }
    };
    const handlers = {
        handleInvestigate: (row) => {
            setSelectedRecord(row);
        },
        handleRefund: (row) => {
            setSelectedRecord(row);
            setModal({ type: 'REFUND', data: row })
        },
        getBankName: (bankId) => {
            if (!banks || banks.length === 0) return bankId;
            const bank = banks.find(b => b.value === bankId || b.code === bankId || b.shortName === bankId);
            return bank ? bank.label : bankId;
        },
        handleCreateDispute: (row) => {
            setSelectedRecord(row);
            setModal({ type: 'DISPUTE', data: row })
        },
        handleViewDetails: (row) => {
            setSelectedRecord(row);
            setModal({ type: 'DETAIL', data: row })
        },
        handleUpdateStatus: async (row) => {
            setSelectedRecord(row);
            try {
                const result = await apiClient.post('/payment/transactionstatus', { seqNo: row.seqNo });
                if (result.responseCode === '00') {
                    showToast({
                        variant: 'info',
                        title: 'Chức năng đang phát triển',
                        message: 'Cập nhật trạng thái giao dịch sẽ sớm được triển khai.',
                    });
                } else {
                    showToast({
                        variant: 'error',
                        title: 'Thất bại',
                        message: `Không thể cập nhật trạng thái: ${result.responseMessage || 'Lỗi không xác định'}`,
                    });
                }
            } catch (error) {
                showToast({
                    variant: 'error',
                    title: 'Thất bại',
                    message: `Không thể cập nhật trạng thái: ${error.message || 'Lỗi không xác định'}`,
                });
            } finally {
                searchPageRef.current?.refresh();
            }


        }
    };
    const closeModal = () => setModal({ type: null, data: null });
    const handleConfirmRefund = async (id, values) => {
        setSubmitting(true);
        try {
            const result = await apiClient.post('/payment/returnIbft', { seqNo: id, ...values });
            console.log("Kết quả hoàn trả:", result);
            if (result.responseCode === '00') {
                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: 'Đã gửi yêu cầu hoàn trả',
                });
            } else {
                showToast({
                    variant: 'error',
                    title: 'Thất bại',
                    message: `Không thể hoàn trả: ${result.responseMessage || 'Lỗi không xác định'}`,
                });
            }


            searchPageRef.current?.refresh();
        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Thất bại',
                message: `Không thể hoàn trả: ${error.response?.data?.message || error.message || 'Lỗi không xác định'}`,
            });
        } finally {
            closeModal();
            setSubmitting(false);
        }
    };
    const handleConfirmDispute = async (id, values) => {
        console.log("Dữ liệu tra soát:", { id, ...values });
        console.log(values.attachment);
        setSubmitting(true);
        const disputeData = {
            seqNo: id,
            amount: values.amount != 0 ? values.amount : null,
            disputeMessage: values.content,
            disputeSubject: `Tra soát giao dịch ${selectedRecord?.transRef || ''}`,
            disputeType: values.disputeType,
            fileAttachment: values.attachment ? await generateFileAttachment(values.attachment) : [],
            indicator: "TCNL"
        }
        try {
            const result = await apiClient.post('/dispute/create', disputeData);
            if (result.responseCode === '00') {
                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: 'Đã gửi yêu cầu tra soát',
                });
            } else {
                showToast({
                    variant: 'error',
                    title: 'Thất bại',
                    message: `Không thể tạo tra soát: ${result.responseMessage || 'Lỗi không xác định'}`,
                });
            }


        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Thất bại',
                message: `Không thể tạo tra soát: ${error.message || 'Lỗi không xác định'}`,
            });
        } finally {
            setSubmitting(false);
            closeModal();
            searchPageRef.current?.refresh();
        }

    }
    return (
        <>
            <BaseSearchPage
                configId="incoming-payment"
                handlers={handlers}
                ref={searchPageRef}
            />
            {
                selectedRecord && (
                    <>
                        <RefundModal
                            opened={modal.type === 'REFUND'}
                            onClose={closeModal}
                            record={selectedRecord}
                            onConfirm={handleConfirmRefund}
                            loading={submitting}
                            handlers={handlers}
                        />
                        <DisputeModal
                            opened={modal.type === 'DISPUTE'}
                            onClose={closeModal}
                            record={selectedRecord}
                            onConfirm={handleConfirmDispute}
                            loading={submitting}
                            type="TCNL"
                            handlers={handlers}
                        />
                        <PaymentDetailModal
                            opened={modal.type === 'DETAIL'}
                            onClose={closeModal}
                            record={selectedRecord}
                            handlers={handlers}
                        />
                    </>
                )
            }


        </>

    );
}