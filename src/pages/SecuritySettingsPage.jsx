import { Container, Title, Text, Stack, Card, Button, PasswordInput, Group, Switch, Alert } from '@mantine/core'
import { IconAlertCircle, IconLock } from '@tabler/icons-react'
import { useState } from 'react'
import { showToast } from '../config/toast'

export function SecuritySettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [sessionLoading, setSessionLoading] = useState(false)

    const handleChangePassword = async (e) => {
        e.preventDefault()

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Validation Error',
                message: 'Please fill in all password fields.',
            })
            return
        }

        if (newPassword !== confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Password Mismatch',
                message: 'New password and confirmation do not match.',
            })
            return
        }

        if (newPassword.length < 8) {
            showToast({
                variant: 'error',
                title: 'Weak Password',
                message: 'Password must be at least 8 characters long.',
            })
            return
        }

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            showToast({
                variant: 'success',
                title: 'Password Changed',
                message: 'Your password has been successfully updated.',
            })

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setLoading(false)
        }, 800)
    }

    const handleToggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled)
        showToast({
            variant: 'info',
            title: twoFactorEnabled ? 'Two-Factor Authentication Disabled' : 'Two-Factor Authentication Enabled',
            message: twoFactorEnabled
                ? 'Your account is now less secure.'
                : 'Your account is now protected with 2FA.',
        })
    }

    const handleClearSessions = async () => {
        setSessionLoading(true)

        // Simulate API call
        setTimeout(() => {
            showToast({
                variant: 'success',
                title: 'Sessions Cleared',
                message: 'All other sessions have been logged out.',
            })
            setSessionLoading(false)
        }, 600)
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                {/* Header */}
                <div>
                    <Title order={2} className="text-slate-800 flex items-center gap-2">
                        <IconLock size={28} className="text-violet-600" />
                        Security Settings
                    </Title>
                    <Text size="sm" className="text-slate-500 mt-1">
                        Manage your account security and authentication preferences
                    </Text>
                </div>

                {/* Change Password */}
                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Stack gap="md">
                        <div>
                            <Title order={4} className="text-slate-800">
                                Change Password
                            </Title>
                            <Text size="sm" className="text-slate-500">
                                Update your password regularly to keep your account secure
                            </Text>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <PasswordInput
                                label="Current Password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.currentTarget.value)}
                                disabled={loading}
                                classNames={{
                                    label: 'text-slate-700 text-sm font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400',
                                }}
                            />

                            <PasswordInput
                                label="New Password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.currentTarget.value)}
                                disabled={loading}
                                classNames={{
                                    label: 'text-slate-700 text-sm font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400',
                                }}
                            />

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                disabled={loading}
                                classNames={{
                                    label: 'text-slate-700 text-sm font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400',
                                }}
                            />

                            <Button
                                type="submit"
                                color="violet"
                                loading={loading}
                                className="mt-2"
                            >
                                Update Password
                            </Button>
                        </form>
                    </Stack>
                </Card>

                {/* Two-Factor Authentication */}
                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Stack gap="md">
                        <div>
                            <Title order={4} className="text-slate-800">
                                Two-Factor Authentication (2FA)
                            </Title>
                            <Text size="sm" className="text-slate-500">
                                Add an extra layer of security to your account
                            </Text>
                        </div>

                        <Alert icon={<IconAlertCircle size={16} />} color="blue" className="bg-blue-50 border-blue-200">
                            <Text size="sm" className="text-slate-700">
                                Two-factor authentication requires a second verification method when logging in.
                            </Text>
                        </Alert>

                        <Switch
                            label={twoFactorEnabled ? 'Two-Factor Authentication is Enabled' : 'Enable Two-Factor Authentication'}
                            checked={twoFactorEnabled}
                            onChange={handleToggleTwoFactor}
                            classNames={{
                                label: 'text-slate-700 font-medium',
                            }}
                        />
                    </Stack>
                </Card>

                {/* Active Sessions */}
                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Stack gap="md">
                        <div>
                            <Title order={4} className="text-slate-800">
                                Active Sessions
                            </Title>
                            <Text size="sm" className="text-slate-500">
                                Manage your active login sessions
                            </Text>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Text size="sm" fw={600} className="text-slate-800">
                                            Current Session
                                        </Text>
                                        <Text size="xs" className="text-slate-500 mt-1">
                                            Windows • Chrome • Last active: Just now
                                        </Text>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Active</span>
                                </div>
                            </div>

                            <Group justify="flex-end">
                                <Button
                                    variant="light"
                                    color="red"
                                    size="sm"
                                    loading={sessionLoading}
                                    onClick={handleClearSessions}
                                >
                                    Clear All Other Sessions
                                </Button>
                            </Group>
                        </div>
                    </Stack>
                </Card>

                {/* Login History */}
                <Card withBorder shadow="sm" className="bg-white border-slate-200">
                    <Stack gap="md">
                        <div>
                            <Title order={4} className="text-slate-800">
                                Recent Login Activity
                            </Title>
                            <Text size="sm" className="text-slate-500">
                                Your last 5 login attempts
                            </Text>
                        </div>

                        <div className="space-y-2">
                            {[
                                { time: '2 minutes ago', device: 'Windows • Chrome', status: 'Success' },
                                { time: '1 hour ago', device: 'Windows • Chrome', status: 'Success' },
                                { time: '5 hours ago', device: 'iPhone • Safari', status: 'Success' },
                                { time: '1 day ago', device: 'Windows • Firefox', status: 'Success' },
                                { time: '2 days ago', device: 'Android • Chrome', status: 'Success' },
                            ].map((login, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
                                    <div>
                                        <Text size="sm" className="text-slate-800">{login.device}</Text>
                                        <Text size="xs" className="text-slate-500">{login.time}</Text>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                        {login.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Stack>
                </Card>
            </Stack>
        </Container>
    )
}
