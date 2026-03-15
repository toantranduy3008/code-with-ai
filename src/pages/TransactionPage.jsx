import { useState, useEffect, useRef } from 'react'
import { Container, Title, Text, Paper, Stack, Group, Select, TextInput, Button, Alert, Modal, Center, Loader, FileInput } from '@mantine/core'
import { IconAlertCircle, IconQrcode, IconCheck, IconX, IconUpload } from '@tabler/icons-react'
import { showToast } from '../config/toast'

export default function TransactionPage() {
    const [sourceBank, setSourceBank] = useState(null)
    const [destinationBank, setDestinationBank] = useState(null)
    const [sourceType, setSourceType] = useState(null)
    const [destinationType, setDestinationType] = useState(null)
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [qrModalOpen, setQrModalOpen] = useState(false)
    const [qrLoading, setQrLoading] = useState(false)
    const [qrResultOpen, setQrResultOpen] = useState(false)
    const [qrResult, setQrResult] = useState(null)
    const videoRef = useRef(null)
    const qrCanvasRef = useRef(null)
    const scanIntervalRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (qrModalOpen) {
            console.log('Modal opened, initializing scanner')
            // Add delay to ensure video element is rendered
            const timer = setTimeout(() => {
                if (videoRef.current) {
                    initQRScanner()
                } else {
                    console.error('Video ref still not available after delay')
                }
            }, 100)

            return () => clearTimeout(timer)
        }
        return () => {
            if (qrModalOpen) {
                console.log('Cleaning up scanner')
                // Only clear resources, don't close modal in cleanup
                if (scanIntervalRef.current) {
                    clearInterval(scanIntervalRef.current)
                    scanIntervalRef.current = null
                }
                if (videoRef.current && videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks()
                    tracks.forEach(track => track.stop())
                    videoRef.current.srcObject = null
                }
            }
        }
    }, [qrModalOpen])

    const bankOptions = [
        { value: 'vietcombank', label: 'Vietcombank' },
        { value: 'techcombank', label: 'Techcombank' },
        { value: 'vietinbank', label: 'Vietinbank' },
        { value: 'agribank', label: 'Agribank' },
        { value: 'sacombank', label: 'Sacombank' },
    ]

    const transactionTypeOptions = [
        { value: 'account', label: 'Tài khoản (Account)' },
        { value: 'card', label: 'Thẻ (Card)' },
    ]

    const initQRScanner = async () => {
        setQrLoading(true)
        try {
            const constraints = {
                audio: false,
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints)

            if (!videoRef.current) {
                console.error('Video ref not available')
                return
            }

            videoRef.current.srcObject = stream

            // Wait for video to load metadata
            videoRef.current.onloadedmetadata = () => {
                console.log('Video loaded, starting scan')
                setQrLoading(false)
                scanQRCode()
            }
        } catch (err) {
            console.error('Camera error:', err)
            let errorMsg = 'Không thể truy cập camera'

            if (err.name === 'NotAllowedError') {
                errorMsg = 'Quyền truy cập camera bị từ chối'
            } else if (err.name === 'NotFoundError') {
                errorMsg = 'Không tìm thấy thiết bị camera'
            } else if (err.name === 'NotReadableError') {
                errorMsg = 'Camera đang được sử dụng bởi ứng dụng khác'
            }

            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: errorMsg,
            })
            setQrLoading(false)
            closeQRScanner()
        }
    }

    const scanQRCode = () => {
        const canvas = qrCanvasRef.current
        const video = videoRef.current

        if (!canvas || !video) return

        const context = canvas.getContext('2d')

        scanIntervalRef.current = setInterval(() => {
            try {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    context.drawImage(video, 0, 0, canvas.width, canvas.height)

                    console.log('Scanning QR code...', canvas.width, 'x', canvas.height)
                }
            } catch (e) {
                console.error('Scan error:', e)
            }
        }, 500)

        // For demo, stop scanning after 3 seconds and show success
        setTimeout(() => {
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current)
            }
            if (qrModalOpen) {
                handleQRScanned('{"destinationBank":"vietcombank","sourceBank":"techcombank","destinationType":"account","sourceType":"card","amount":"500000","description":"Thanh toán hóa đơn"}')
            }
        }, 3000)
    }

    const handleQRScanned = (qrData) => {
        try {
            const data = JSON.parse(qrData)
            console.log('QR data parsed:', data)

            // Close scanner modal
            closeQRScanner()

            // Show result modal
            setQrResult(data)
            setQrResultOpen(true)
        } catch (err) {
            console.error('QR parse error:', err)
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Dữ liệu QR không hợp lệ',
            })
        }
    }

    const handleConfirmScanResult = () => {
        if (!qrResult) return

        // Auto-fill form with QR data
        if (qrResult.destinationBank) setDestinationBank(qrResult.destinationBank)
        if (qrResult.sourceBank) setSourceBank(qrResult.sourceBank)
        if (qrResult.destinationType) setDestinationType(qrResult.destinationType)
        if (qrResult.sourceType) setSourceType(qrResult.sourceType)
        if (qrResult.amount) {
            const formattedAmount = qrResult.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            setAmount(formattedAmount)
        }
        if (qrResult.description) setDescription(qrResult.description)

        showToast({
            variant: 'success',
            title: 'Thành công',
            message: 'Đã điền thông tin từ mã QR',
        })

        // Close result modal and clear result
        setQrResultOpen(false)
        setQrResult(null)
    }

    const handleCancelScanResult = () => {
        setQrResultOpen(false)
        setQrResult(null)
    }

    const handleQRImport = async (file) => {
        if (!file) return

        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const img = new Image()
                img.onload = () => {
                    // Close scanner modal
                    closeQRScanner()

                    // Create canvas and draw image
                    const canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0)

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                    // Try to detect QR code using jsQR if available
                    try {
                        // Dynamic import of jsQR - install with: npm install jsqr
                        // eslint-disable-next-line no-eval
                        const jsQR = eval('require("jsqr")')
                        const code = jsQR(imageData.data, imageData.width, imageData.height)
                        if (code) {
                            console.log('QR detected:', code.data)
                            handleQRScanned(code.data)
                        } else {
                            // No QR detected, show demo data for testing
                            showToast({
                                variant: 'info',
                                title: 'Thông báo',
                                message: 'Không tìm thấy mã QR trong hình ảnh. Hiển thị dữ liệu demo.',
                            })
                            handleQRScanned('{"destinationBank":"vietcombank","sourceBank":"techcombank","destinationType":"account","sourceType":"card","amount":"500000","description":"Thanh toán hóa đơn"}')
                        }
                    } catch (err) {
                        console.log('jsQR not available, showing demo data')
                        // jsQR not installed, show demo data
                        showToast({
                            variant: 'info',
                            title: 'Thông báo',
                            message: 'Đang hiển thị dữ liệu demo. Cài đặt jsQR để quét mã QR thực tế.',
                        })
                        handleQRScanned('{"destinationBank":"vietcombank","sourceBank":"techcombank","destinationType":"account","sourceType":"card","amount":"500000","description":"Thanh toán hóa đơn"}')
                    }
                }
                img.src = e.target.result
            }
            reader.readAsDataURL(file)
        } catch (err) {
            console.error('Import error:', err)
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Lỗi khi tải hình ảnh',
            })
        }
    }

    const closeQRScanner = () => {
        console.log('Closing QR scanner modal')
        setQrModalOpen(false)
    }

    const handleQRScan = () => {
        console.log('QR scan button clicked')
        setQrModalOpen(true)
    }

    const handleAmountChange = (e) => {
        const value = e.currentTarget.value
        // Remove commas and keep only digits
        const numericValue = value.replace(/,/g, '')

        if (numericValue === '') {
            setAmount('')
        } else if (!isNaN(numericValue)) {
            // Format with commas
            const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            setAmount(formatted)
        }
    }

    const handleConfirmTransaction = async (e) => {
        e.preventDefault()

        // Validation
        if (!sourceBank || !destinationBank || !sourceType || !destinationType || !amount || !description) {
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Vui lòng điền đầy đủ tất cả các trường',
            })
            return
        }

        if (isNaN(amount) || parseFloat(amount.replace(/,/g, '')) <= 0) {
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Số tiền phải lớn hơn 0',
            })
            return
        }

        setLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            const transactionData = {
                sourceBank,
                destinationBank,
                sourceType,
                destinationType,
                amount: parseFloat(amount.replace(/,/g, '')),
                description,
                timestamp: new Date().toISOString(),
            }

            console.log('Transaction submitted:', transactionData)

            showToast({
                variant: 'success',
                title: 'Thành công',
                message: `Giao dịch ${amount} VND đã được xác nhận`,
            })

            // Reset form
            setSourceBank(null)
            setDestinationBank(null)
            setSourceType(null)
            setDestinationType(null)
            setAmount('')
            setDescription('')
        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi xử lý giao dịch',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="text-slate-800">
                        Giao dịch
                    </Title>
                    <Text size="sm" className="text-slate-500">
                        Thực hiện giao dịch chuyển tiền
                    </Text>
                </div>

                <Paper withBorder shadow="md" p="lg" radius="lg" className="bg-white border-slate-200">
                    <Stack gap="md">
                        {/* Bank Selection */}
                        <Group grow>
                            <Select
                                label="Ngân hàng nguồn"
                                placeholder="Chọn ngân hàng"
                                data={bankOptions}
                                value={sourceBank}
                                onChange={setSourceBank}
                                searchable
                                clearable
                                classNames={{
                                    label: 'text-slate-700 font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800',
                                    option: 'text-slate-800',
                                }}
                            />
                            <Select
                                label="Ngân hàng đích"
                                placeholder="Chọn ngân hàng"
                                data={bankOptions}
                                value={destinationBank}
                                onChange={setDestinationBank}
                                searchable
                                clearable
                                classNames={{
                                    label: 'text-slate-700 font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800',
                                    option: 'text-slate-800',
                                }}
                            />
                        </Group>

                        {/* Transaction Type Selection */}
                        <Group grow>
                            <Select
                                label="Loại giao dịch nguồn"
                                placeholder="Chọn loại"
                                data={transactionTypeOptions}
                                value={sourceType}
                                onChange={setSourceType}
                                searchable
                                clearable
                                classNames={{
                                    label: 'text-slate-700 font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800',
                                    option: 'text-slate-800',
                                }}
                            />
                            <Select
                                label="Loại giao dịch đích"
                                placeholder="Chọn loại"
                                data={transactionTypeOptions}
                                value={destinationType}
                                onChange={setDestinationType}
                                searchable
                                clearable
                                classNames={{
                                    label: 'text-slate-700 font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800',
                                    option: 'text-slate-800',
                                }}
                            />
                        </Group>

                        {/* Amount and Description */}
                        <Group grow>
                            <TextInput
                                label="Số tiền"
                                placeholder="Nhập số tiền"
                                value={amount}
                                onChange={handleAmountChange}
                                classNames={{
                                    label: 'text-slate-700 font-medium',
                                    input: 'bg-slate-50 border-slate-200 text-slate-800',
                                }}
                                rightSection={<Text size="sm" className="text-slate-500">VND</Text>}
                            />
                        </Group>

                        <TextInput
                            label="Mô tả giao dịch"
                            placeholder="Nhập mô tả giao dịch"
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                            classNames={{
                                label: 'text-slate-700 font-medium',
                                input: 'bg-slate-50 border-slate-200 text-slate-800',
                            }}
                        />

                        {/* Warning Alert */}
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="Xác nhận"
                            color="yellow"
                            variant="light"
                            className="bg-amber-50 border-amber-200 text-amber-900"
                        >
                            Vui lòng xác nhận tất cả thông tin trước khi xác nhận giao dịch
                        </Alert>

                        {/* Action Buttons */}
                        <Group grow>
                            <Button
                                leftSection={<IconQrcode size={18} />}
                                variant="default"
                                onClick={handleQRScan}
                                className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-slate-300"
                            >
                                Quét QR
                            </Button>
                            <Button
                                leftSection={<IconCheck size={18} />}
                                className="bg-violet-600 hover:bg-violet-700"
                                onClick={handleConfirmTransaction}
                                loading={loading}
                                disabled={loading}
                            >
                                Xác nhận giao dịch
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </Stack>

            {/* QR Scanner Modal */}
            <Modal
                opened={qrModalOpen}
                onClose={closeQRScanner}
                title="Quét mã QR"
                centered
                size="md"
                withOverlay={true}
                zIndex={1000}
                styles={{
                    body: { padding: '16px', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' },
                    header: { paddingBottom: '12px', borderBottom: '1px solid rgb(226, 232, 240)' },
                }}
                classNames={{
                    content: 'bg-white border-slate-200',
                    header: 'bg-white border-slate-200',
                    title: 'text-lg text-slate-800 font-bold',
                    close: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors',
                }}
            >
                <Stack gap="md" align="stretch">
                    {/* Camera Section */}
                    <div className="relative w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden border-2 border-violet-400/50 shadow-lg" style={{ aspectRatio: '1' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scaleX(-1)',
                            }}
                        />
                        {/* Corner Indicators */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-violet-400" style={{ borderRadius: '2px 0 0 0' }}></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-violet-400" style={{ borderRadius: '0 2px 0 0' }}></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-violet-400" style={{ borderRadius: '0 0 0 2px' }}></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-violet-400" style={{ borderRadius: '0 0 2px 0' }}></div>

                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 border-2 border-violet-400 rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-400 to-transparent opacity-50"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-6 bg-gradient-to-r from-violet-400 to-transparent opacity-50"></div>
                        </div>

                        {/* Loading Overlay */}
                        {qrLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                <Loader color="violet" size="md" />
                                <Text size="xs" className="text-violet-600 mt-2 font-medium">Khởi động camera...</Text>
                            </div>
                        )}

                        {/* Scanning Animation */}
                        {!qrLoading && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent" style={{
                                animation: 'scan 2s infinite',
                                top: '25%',
                            }}></div>
                        )}
                    </div>

                    {/* Buttons Section */}
                    <Group grow gap="sm">
                        <Button
                            size="md"
                            leftSection={<IconX size={18} />}
                            onClick={closeQRScanner}
                            className="bg-red-600/80 hover:bg-red-700 text-white transition-all duration-200"
                        >
                            Hủy
                        </Button>
                        <Button
                            size="md"
                            leftSection={<IconUpload size={18} />}
                            className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white shadow-lg shadow-violet-300/50 transition-all duration-200"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Nhập ảnh
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.currentTarget.files?.[0]
                                if (file) {
                                    handleQRImport(file)
                                    e.currentTarget.value = ''
                                }
                            }}
                        />
                    </Group>

                    <style>{`
                        @keyframes scan {
                            0% { top: 0%; }
                            50% { top: 50%; }
                            100% { top: 100%; }
                        }
                    `}</style>
                </Stack>
            </Modal>

            {/* QR Scan Result Modal */}
            <Modal
                opened={qrResultOpen}
                onClose={handleCancelScanResult}
                title="Kết quả quét mã QR"
                centered
                size="sm"
                classNames={{
                    content: 'bg-white border-slate-200',
                    header: 'bg-white border-slate-200',
                    title: 'text-slate-800 font-semibold',
                    close: 'text-slate-500 hover:text-slate-800',
                }}
            >
                <Stack gap="md">
                    {qrResult && (
                        <>
                            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                {qrResult.sourceBank && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Ngân hàng nguồn</Text>
                                        <Text size="sm" className="text-slate-800 font-medium">
                                            {bankOptions.find(b => b.value === qrResult.sourceBank)?.label || qrResult.sourceBank}
                                        </Text>
                                    </div>
                                )}
                                {qrResult.destinationBank && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Ngân hàng đích</Text>
                                        <Text size="sm" className="text-slate-800 font-medium">
                                            {bankOptions.find(b => b.value === qrResult.destinationBank)?.label || qrResult.destinationBank}
                                        </Text>
                                    </div>
                                )}
                                {qrResult.sourceType && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Loại giao dịch nguồn</Text>
                                        <Text size="sm" className="text-slate-800 font-medium">
                                            {transactionTypeOptions.find(t => t.value === qrResult.sourceType)?.label || qrResult.sourceType}
                                        </Text>
                                    </div>
                                )}
                                {qrResult.destinationType && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Loại giao dịch đích</Text>
                                        <Text size="sm" className="text-slate-800 font-medium">
                                            {transactionTypeOptions.find(t => t.value === qrResult.destinationType)?.label || qrResult.destinationType}
                                        </Text>
                                    </div>
                                )}
                                {qrResult.amount && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Số tiền</Text>
                                        <Text size="sm" className="text-green-600 font-medium">
                                            {qrResult.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
                                        </Text>
                                    </div>
                                )}
                                {qrResult.description && (
                                    <div>
                                        <Text size="xs" className="text-slate-500">Mô tả</Text>
                                        <Text size="sm" className="text-slate-800 font-medium">
                                            {qrResult.description}
                                        </Text>
                                    </div>
                                )}
                            </div>

                            <Alert
                                icon={<IconAlertCircle size={16} />}
                                color="blue"
                                variant="light"
                                className="bg-blue-50 border-blue-200 text-blue-800"
                            >
                                Xác nhận để điền thông tin vào biểu mẫu
                            </Alert>

                            <Group grow>
                                <Button
                                    variant="default"
                                    onClick={handleCancelScanResult}
                                    className="bg-slate-200 text-slate-800 hover:bg-slate-300"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    leftSection={<IconCheck size={18} />}
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleConfirmScanResult}
                                >
                                    Xác nhận
                                </Button>
                            </Group>
                        </>
                    )}
                </Stack>
            </Modal>
        </Container>
    )
}
