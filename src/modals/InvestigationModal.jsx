// components/modals/PaymentDetailModal.jsx
import { Modal, Button, Group, Text } from '@mantine/core';

export function InvestigationlModal({ opened, onClose, data, onApprove }) {
    if (!data) return null;

    return (
        <Modal opened={opened} onClose={onClose} title="Chi tiết giao dịch" size="lg">
            <Text>Mã giao dịch: {data.transRef}</Text>
            <Text>Số tiền: {data.amount}</Text>

            <Group justify="flex-end" mt="xl">
                <Button variant="outline" onClick={onClose}>Đóng</Button>
                <Button color="green" onClick={() => onApprove(data.id)}>Phê duyệt</Button>
            </Group>
        </Modal>
    );
}