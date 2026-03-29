import { Menu, ActionIcon, rem } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

export function RowActionMenu({ actions }) {
    if (!actions || actions.length === 0) return null;

    return (
        <Menu shadow="md" width={200} position="bottom-end" withArrow>
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {actions.map((action, index) => (
                    <Menu.Item
                        key={index}
                        leftSection={action.icon}
                        color={action.color}
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}