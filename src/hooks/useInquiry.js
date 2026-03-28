import { useState, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { showToast } from '../config/toast';

export const useInquiry = (onInquirySuccess, onInquiryError) => {
    const [inquiryLoading, setInquiryLoading] = useState(false);

    const executeInquiry = useCallback(async (formData) => {
        const { destinationBank, destinationType, sourceTo, sourceFrom } = formData;

        // Validation nhanh
        if (!destinationBank || !destinationType || !sourceTo || !sourceFrom) {
            return;
        }

        setInquiryLoading(true);
        try {
            const response = await transactionService.fetchInquiry(
                destinationBank,
                destinationType,
                sourceTo,
                sourceFrom
            );

            console.log("Response from Inquiry API:", response);

            if (response?.f39 === "00") {
                if (onInquirySuccess) {
                    onInquirySuccess(response);
                }

                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: `Tên người thụ hưởng: ${response.f120}`
                });
            } else {
                if (onInquiryError) {
                    onInquiryError(response);
                }

                showToast({
                    variant: 'error',
                    title: 'Lỗi truy vấn',
                    message: `Mã lỗi ${response?.f39}. Ref ${response?.f63}: Không tìm thấy thông tin.`
                });
            }
        } catch (error) {
            console.error("Lỗi:", error);
            if (onInquiryError) {
                onInquiryError(null);
            }
        } finally {
            setInquiryLoading(false);
        }
    }, [onInquirySuccess, onInquiryError]);

    return {
        inquiryLoading,
        executeInquiry
    };
};
