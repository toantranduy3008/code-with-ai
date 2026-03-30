import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

export function RowActionMenu({ actions = [] }) {
    // Nếu dòng này không có action nào (vd: outgoing-dispute), không hiện menu
    if (actions.length === 0) return null;

    return (
        <Menu shadow="md" width={200} position="bottom-end" withArrow>
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={16} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {actions.map((action, index) => (
                    <Menu.Item
                        key={index}
                        leftSection={action.icon}
                        color={action.color} // Tự động đổi màu đỏ nếu là Hoàn trả
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}