import { useState, useCallback } from 'react';
import apiClient from '../config/apiClient';
import { MOCK_API_RESPONSES } from '../config/mockData';
export const useSearch = (apiEndpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ activePage: 1, totalPages: 1 });

    const fetchData = useCallback(async (filters = {}, page = 1) => {
        setLoading(true);
        console.log(filters)
        try {
            const params = {
                ...filters,
                page: page - 1,
                size: filters.pageSize || 10,
                beginDate: new Date(filters.fromDate).toISOString(),
                endDate: new Date(filters.toDate).toISOString(),
                senderId: "555666",
                receiverId: "",
                disputeId: '',
                originalTranRef: filters.transRef || '',
                disputeType: '',
                disputeStatus: '',
                sort: 'id,desc'
            };

            // var response = await apiClient.get(apiEndpoint, { params });
            const response = MOCK_API_RESPONSES[apiEndpoint] || { content: [], totalPages: 0, totalElements: 0 };
            console.log("API Response for", apiEndpoint, "with params", params, ":", response);
            const { content, totalPages, totalElements } = response;

            setData(content);
            setPagination({ activePage: page, totalPages, totalElements });
        } catch (error) {
            console.error("Search API Error:", error);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    return { data, loading, pagination, fetchData };
};