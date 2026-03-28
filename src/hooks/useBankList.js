import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

export const useBankList = () => {
    const [banks, setBanks] = useState([]);
    const [fetchingBanks, setFetchingBanks] = useState(false);

    useEffect(() => {
        const loadBanks = async () => {
            setFetchingBanks(true);
            try {
                const bankList = await transactionService.fetchBanks();
                setBanks(bankList);
            } catch (error) {
                console.error("Lỗi khi tải danh sách ngân hàng:", error);
            } finally {
                setFetchingBanks(false);
            }
        };

        loadBanks();
    }, []);

    return {
        banks,
        fetchingBanks
    };
};
