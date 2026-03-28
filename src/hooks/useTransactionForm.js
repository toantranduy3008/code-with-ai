import { useState, useCallback } from 'react';

const INITIAL_FORM_DATA = {
    sourceBank: '',
    destinationBank: '555666',
    sourceType: '',
    destinationType: '',
    amount: '',
    description: '',
    sourceFrom: 'ACC',
    sourceTo: 'ACC',
    beneficiaryName: '',
    transactionRef: '',
    f63: '',
    qr: false
};

export const useTransactionForm = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [qrType, setQrType] = useState('static');

    const updateFormField = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const updateMultipleFields = useCallback((updates) => {
        setFormData(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setQrType('static');
    }, []);

    const setQRData = useCallback((qrData) => {
        const beneficiary = qrData.consumer;
        const newData = {
            destinationType: beneficiary?.bankNumber || formData.destinationType,
            amount: qrData.amount ? Number(qrData.amount) : formData.amount,
            description: qrData.additionalData?.purpose || formData.description,
            destinationBank: beneficiary?.bankBin || formData.destinationBank,
            sourceTo: 'ACC',
            sourceFrom: 'ACC'
        };
        setQrType(qrData.initMethod === 11 ? 'static' : 'dynamic');
        return newData;
    }, [formData]);

    return {
        formData,
        qrType,
        setFormData,
        setQrType,
        updateFormField,
        updateMultipleFields,
        resetForm,
        setQRData
    };
};
