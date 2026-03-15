import { useState } from 'react'
import {
    Container,
    Title,
    Paper,
    Stack,
    Group,
    TextInput,
    Select,
    Button,
    Flex,
    Pagination,
    Table,
    Text,
    Badge,
    Center,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import {
    IconSearch,
    IconRefresh,
    IconCalendar,
    IconFilter,
} from '@tabler/icons-react'

export default function SearchPaymentPage() {
    // Search filters state
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [transactionRef, setTransactionRef] = useState('')
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [activePage, setActivePage] = useState(1)

    // Transaction status options
    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'processing', label: 'Processing' },
    ]

    // Sample transaction data (replace with API call)
    const sampleTransactions = [
        {
            id: 'TXN001',
            reference: 'REF-2024-001',
            amount: 1000000,
            status: 'completed',
            date: '2024-01-15',
            time: '10:30',
        },
        {
            id: 'TXN002',
            reference: 'REF-2024-002',
            amount: 500000,
            status: 'pending',
            date: '2024-01-16',
            time: '14:45',
        },
        {
            id: 'TXN003',
            reference: 'REF-2024-003',
            amount: 2000000,
            status: 'completed',
            date: '2024-01-17',
            time: '09:15',
        },
        {
            id: 'TXN004',
            reference: 'REF-2024-004',
            amount: 750000,
            status: 'failed',
            date: '2024-01-18',
            time: '16:20',
        },
        {
            id: 'TXN005',
            reference: 'REF-2024-005',
            amount: 1500000,
            status: 'processing',
            date: '2024-01-19',
            time: '11:00',
        },
    ]

    const itemsPerPage = 5
    const totalPages = Math.ceil(sampleTransactions.length / itemsPerPage)

    // Handle search
    const handleSearch = () => {
        console.log('Search clicked with:', {
            fromDate,
            toDate,
            transactionRef,
            transactionStatus,
        })
        // Add your API call here
        setActivePage(1) // Reset to first page on search
    }

    // Handle reset
    const handleReset = () => {
        setFromDate(null)
        setToDate(null)
        setTransactionRef('')
        setTransactionStatus(null)
        setActivePage(1)
    }

    // Get current page data
    const startIdx = (activePage - 1) * itemsPerPage
    const currentData = sampleTransactions.slice(startIdx, startIdx + itemsPerPage)

    // Get status badge color
    const getStatusColor = (status) => {
        const colors = {
            completed: 'green',
            pending: 'yellow',
            failed: 'red',
            cancelled: 'gray',
            processing: 'blue',
        }
        return colors[status] || 'gray'
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                {/* Page Title */}
                <div>
                    <Title order={1} className="flex items-center gap-2">
                        <IconSearch size={28} />
                        Search Payment Transactions
                    </Title>
                    <Text c="dimmed" size="sm" mt="xs">
                        Search and filter your payment transactions
                    </Text>
                </div>

                {/* Search Filters */}
                <Paper p="md" radius="md" withBorder className="bg-white">
                    <Stack gap="md">
                        <Group align="flex-end" grow>
                            {/* From Date */}
                            <DateInput
                                label="From Date"
                                placeholder="Select from date"
                                value={fromDate}
                                onChange={setFromDate}
                                icon={<IconCalendar size={16} />}
                                clearable
                            />

                            {/* To Date */}
                            <DateInput
                                label="To Date"
                                placeholder="Select to date"
                                value={toDate}
                                onChange={setToDate}
                                icon={<IconCalendar size={16} />}
                                clearable
                            />
                        </Group>

                        <Group align="flex-end" grow>
                            {/* Transaction Reference */}
                            <TextInput
                                label="Transaction Reference"
                                placeholder="Enter reference number"
                                value={transactionRef}
                                onChange={(e) => setTransactionRef(e.currentTarget.value)}
                                icon={<IconFilter size={16} />}
                            />

                            {/* Transaction Status */}
                            <Select
                                label="Transaction Status"
                                placeholder="Select status"
                                data={statusOptions}
                                value={transactionStatus}
                                onChange={setTransactionStatus}
                                clearable
                                searchable
                            />
                        </Group>

                        {/* Action Buttons */}
                        <Group justify="flex-end">
                            <Button
                                variant="light"
                                leftSection={<IconRefresh size={16} />}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button
                                leftSection={<IconSearch size={16} />}
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                {/* Results Table */}
                <Paper p="md" radius="md" withBorder className="bg-white">
                    <Stack gap="md">
                        <div>
                            <Title order={3}>Transaction Results</Title>
                            <Text c="dimmed" size="sm">
                                Showing {startIdx + 1} to{' '}
                                {Math.min(startIdx + itemsPerPage, sampleTransactions.length)} of{' '}
                                {sampleTransactions.length} transactions
                            </Text>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr className="bg-gray-50">
                                        <Table.Th>Transaction ID</Table.Th>
                                        <Table.Th>Reference</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                        <Table.Th>Date & Time</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {currentData.length > 0 ? (
                                        currentData.map((transaction) => (
                                            <Table.Tr key={transaction.id}>
                                                <Table.Td className="font-mono text-sm text-blue-600">
                                                    {transaction.id}
                                                </Table.Td>
                                                <Table.Td>{transaction.reference}</Table.Td>
                                                <Table.Td className="font-semibold">
                                                    {formatCurrency(transaction.amount)}
                                                </Table.Td>
                                                <Table.Td>
                                                    <div className="text-sm">
                                                        <div>{transaction.date}</div>
                                                        <div className="text-gray-500">{transaction.time}</div>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={getStatusColor(transaction.status)}
                                                        variant="light"
                                                        className="capitalize"
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Center py="xl">
                                                    <Text c="dimmed">No transactions found</Text>
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Flex justify="center" mt="lg">
                                <Pagination
                                    value={activePage}
                                    onChange={setActivePage}
                                    total={totalPages}
                                    siblings={1}
                                    boundaries={1}
                                />
                            </Flex>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    )
}
