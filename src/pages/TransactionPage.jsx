import { useState, useEffect, useRef } from 'react'
import { Container, Stack } from '@mantine/core';
import { showToast } from '../config/toast'

// Hooks
import { useTransactionForm } from '../hooks/useTransactionForm'
import { useQRScanner } from '../hooks/useQRScanner'
import { useInquiry } from '../hooks/useInquiry'
import { useBankList } from '../hooks/useBankList'

// Services
import { transactionService } from '../services/transactionService'

// Components
import { QRScannerModal } from '../components/QRScannerModal'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionResultModal } from '../components/TransactionResultModal'
import { IconCheck, IconX } from '@tabler/icons-react';

export default function TransactionPage() {
    // ===== STATE MANAGEMENT =====
    const {
        formData,
        qrType,
        updateFormField,
        updateMultipleFields,
        resetForm,
        setQRData
    } = useTransactionForm();

    const { banks, fetchingBanks } = useBankList();

    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [transactionResult, setTransactionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // ===== QR SCANNER LOGIC =====
    const handleQRDetected = async (qr) => {
        const newData = setQRData(qr);
        updateMultipleFields(newData);
        handleCloseQRModal();
        await executeInquiry(newData);
    };

    const { videoRef, canvasRef, qrLoading, initQRScanner, stopCamera, handleFileUpload } = useQRScanner(handleQRDetected);

    // ===== INQUIRY LOGIC =====
    const handleInquirySuccess = (response) => {
        updateMultipleFields({
            beneficiaryName: response.f120,
            f63: response.f63
        });
    };

    const handleInquiryError = () => {
        resetForm();
    };

    const { inquiryLoading, executeInquiry } = useInquiry(
        handleInquirySuccess,
        handleInquiryError
    );

    // ===== MODAL HANDLERS =====
    const handleCloseQRModal = () => {
        setQrModalOpen(false);
        stopCamera();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenQRModal = () => {
        setQrModalOpen(true);
        // Tự động chạy scanner khi modal mở
    };

    useEffect(() => {
        if (qrModalOpen) {
            initQRScanner();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [qrModalOpen, initQRScanner, stopCamera]);

    // ===== TRANSFER LOGIC =====
    const handleExecuteTransfer = async () => {
        // Validation
        if (!formData.beneficiaryName || !formData.f63) {
            showToast({
                title: 'Chưa xác thực',
                message: 'Vui lòng nhập số tài khoản và đợi xác thực tên người nhận trước khi chuyển tiền.',
                color: 'red'
            });
            return;
        }

        if (!formData.amount || formData.amount < 2000) {
            showToast({
                title: 'Lỗi',
                message: 'Vui lòng nhập số tiền hợp lệ',
                color: 'red'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await transactionService.executeTransfer({
                destinationType: formData.destinationType,
                amount: formData.amount,
                description: formData.description,
                transactionRef: formData.f63
            });

            if (response?.f39 === "00") {
                showToast({
                    title: 'Giao dịch thành công',
                    message: `Mã giao dịch: ${response.f11} - Ref: ${response.f63}`,
                    color: 'green',
                    icon: <IconCheck size={18} />,
                    autoClose: 10000,
                });
            } else {
                showToast({
                    title: 'Giao dịch thất bại',
                    message: `Lỗi: ${response?.f39}. Vui lòng thử lại.`,
                    color: 'red',
                    icon: <IconX size={18} />,
                });
            }

            setTransactionResult(response);
            setResultModalOpen(true);
        } catch (error) {
            console.error("Lỗi chuyển tiền:", error);
            showToast({
                title: 'Lỗi hệ thống',
                message: 'Không thể thực hiện giao dịch. Vui lòng thử lại sau.',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseResultModal = () => {
        setResultModalOpen(false);
        resetForm();
    };

    // ===== FORM FIELD HANDLERS =====
    const handleFieldChange = (field, value) => {
        updateFormField(field, value);
    };

    const handleInquiryBlur = () => {
        executeInquiry(formData);
    };

    // ===== RENDER =====
    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <TransactionForm
                    formData={formData}
                    banks={banks}
                    fetchingBanks={fetchingBanks}
                    inquiryLoading={inquiryLoading}
                    qrType={qrType}
                    loading={loading}
                    onFieldChange={handleFieldChange}
                    onQRClick={handleOpenQRModal}
                    onTransferClick={handleExecuteTransfer}
                    onInquiryBlur={handleInquiryBlur}
                />
            </Stack>

            {/* QR Scanner Modal */}
            <QRScannerModal
                opened={qrModalOpen}
                onClose={handleCloseQRModal}
                qrLoading={qrLoading}
                videoRef={videoRef}
                canvasRef={canvasRef}
                onFileUpload={handleFileUpload}
            />

            {/* Transaction Result Modal */}
            <TransactionResultModal
                opened={resultModalOpen}
                onClose={handleCloseResultModal}
                transactionResult={transactionResult}
                formData={formData}
                onCloseComplete={resetForm}
            />
        </Container>
    );
}