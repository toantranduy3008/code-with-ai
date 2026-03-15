import { Container, Title, Text, Card, Group, Stack } from '@mantine/core'

export function DashboardPage() {
    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="text-slate-800">
                        Dashboard
                    </Title>
                    <Text size="sm" className="text-slate-500">
                        Welcome to your dashboard
                    </Text>
                </div>

                <Group grow>
                    <Card withBorder shadow="sm" className="bg-white border-slate-200">
                        <Text size="lg" fw={600} className="text-slate-800">
                            Total Users
                        </Text>
                        <Text size="32" fw={700} className="text-violet-600 mt-2">
                            1,234
                        </Text>
                    </Card>

                    <Card withBorder shadow="sm" className="bg-white border-slate-200">
                        <Text size="lg" fw={600} className="text-slate-800">
                            Revenue
                        </Text>
                        <Text size="32" fw={700} className="text-green-600 mt-2">
                            $42.5K
                        </Text>
                    </Card>

                    <Card withBorder shadow="sm" className="bg-white border-slate-200">
                        <Text size="lg" fw={600} className="text-slate-800">
                            Active
                        </Text>
                        <Text size="32" fw={700} className="text-blue-600 mt-2">
                            892
                        </Text>
                    </Card>
                </Group>
            </Stack>
        </Container>
    )
}

export function UsersPage() {
    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="text-slate-800">
                        Users
                    </Title>
                    <Text size="sm" className="text-slate-500">
                        Manage your users here
                    </Text>
                </div>

                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Text className="text-slate-600">
                        User management interface coming soon...
                    </Text>
                </Card>
            </Stack>
        </Container>
    )
}

export function SettingsPage() {
    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="text-slate-800">
                        Settings
                    </Title>
                    <Text size="sm" className="text-slate-500">
                        Configure your preferences
                    </Text>
                </div>

                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Text className="text-slate-600">
                        Settings interface coming soon...
                    </Text>
                </Card>
            </Stack>
        </Container>
    )
}
