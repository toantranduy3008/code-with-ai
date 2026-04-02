import { BaseSearchPage } from "../components/BaseSearchPage";
import { useRef, useState } from "react";
import apiClient from "../config/apiClient";
import { showToast } from "../config/toast";
import { useBankList } from "../hooks/useBankList";
import DisputeDetailModal from "../modals/DisputeDetailModal";
import { generateFileAttachment } from "../helper/fileUtils";
export default function IncomingDisputePage() {
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
        getBankName: (bankId) => {
            if (!banks || banks.length === 0) return bankId;
            const bank = banks.find(b => b.value === bankId || b.code === bankId || b.shortName === bankId);
            return bank ? bank.label : bankId;
        },
        handleViewDetails: (row) => {
            setSelectedRecord(row);
            setModal({ type: 'DETAIL', data: row })
        },
    };
    const closeModal = () => setModal({ type: null, data: null });
    const handleConfirmDisputeResponse = async (values) => {
        setSubmitting(true);
        try {
            const result = await apiClient.post('/dispute/answer', {
                ...values,
                fileAttachment: values.attachment ? await generateFileAttachment(values.fileAttachment) : [],
            });
            if (result.responseCode === '00') {
                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: `Phản hồi tra soát thành công.`,
                });

            } else {
                showToast({
                    variant: 'error',
                    title: 'Thất bại',
                    message: `Phản hồi tra soát thất bại: ${result.responseMessage || 'Lỗi không xác định'}`,
                });
            }
        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Thất bại',
                message: `Không thể phản hồi tra soát: ${error.message || 'Lỗi không xác định'}`,
            });
        } finally {
            setSubmitting(false);
            closeModal();
            searchPageRef.current?.refresh();
        }
    };
    return (
        <>
            <BaseSearchPage
                configId="incoming-dispute"
                handlers={handlers}
                ref={searchPageRef}
            />
            <DisputeDetailModal
                opened={modal.type === 'DETAIL'}
                onClose={closeModal}
                record={selectedRecord}
                handlers={handlers}
                onConfirm={handleConfirmDisputeResponse}
                loading={submitting}
            />
        </>

    );
}