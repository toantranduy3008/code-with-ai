import { Modal, ScrollArea, Text } from "@mantine/core";

export const BaseModal = ({ opened, onClose, title, children, size = '80%' }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="sm" c="dimmed">{title}</Text>}
            size={size}
            centered
            radius="lg"
            padding={0}
            styles={{
                header: {
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                    padding: '16px 20px',
                    margin: 0
                },
                body: {
                    // Quan trọng: Cố định chiều cao tối đa của Body để ScrollArea kích hoạt
                    // height: 'calc(100vh - 200px)',
                    maxHeight: '750px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0
                },
                content: { overflow: 'hidden' }
            }}

        >
            <ScrollArea.Autosize mah="calc(100vh - 120px)" p="md">
                {children}
            </ScrollArea.Autosize>
        </Modal>
    );
}