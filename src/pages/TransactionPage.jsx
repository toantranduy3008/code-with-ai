import { useState, useEffect, useRef } from 'react'
import {
    Container,
    Stack,
    Paper,
    Group,
    Select,
    TextInput,
    Text,
    Button,
    Modal,
    Loader,
    SimpleGrid,
    NumberInput,
    Divider
} from '@mantine/core';

import {
    IconQrcode,
    IconUpload,
    IconArrowRightCircle,
    IconWallet,
    IconCheck,
    IconBuildingBank,
    IconSend,
    IconShieldCheck,
    IconSearch,
    IconX
} from '@tabler/icons-react';
import { showToast } from '../config/toast'
import jsQR from 'jsqr'
import { QRPay } from 'vietnam-qr-pay';
import apiClient from '../config/apiClient';
import { FALLBACK_BANKS } from '../config/bankConfig';

export default function TransactionPage() {
    const initalFormData = {
        sourceBank: '',
        destinationBank: '555666',
        sourceType: '',
        destinationType: '',
        amount: '',
        description: '',
        sourceFrom: 'ACC',
        sourceTo: 'ACC',
        beneficiaryName: '',
        transactionRef: '',
        qr: false
    }
    const [formData, setFormData] = useState(initalFormData);
    const [loading, setLoading] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [banks, setBanks] = useState([]);
    const [fetchingBanks, setFetchingBanks] = useState(false);
    const [inquiryLoading, setInquiryLoading] = useState(false);
    const [qrType, setQrType] = useState('static'); // Hoặc 'dynamic' nếu bạn muốn phân biệt loại QR
    // --- Media Handlers ---
    const stopCamera = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
            scanIntervalRef.current = null
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        if (videoRef.current) videoRef.current.srcObject = null
    }

    const initQRScanner = async () => {
        setQrLoading(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            })

            streamRef.current = stream
            let attempts = 0
            const checkRef = setInterval(() => {
                if (videoRef.current && canvasRef.current) {
                    clearInterval(checkRef)
                    videoRef.current.srcObject = stream
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play()
                        setQrLoading(false)
                        startScanning()
                    }
                }
                if (attempts++ > 10) {
                    clearInterval(checkRef)
                    setQrLoading(false)
                }
            }, 100)

        } catch (err) {
            console.error("Camera Error:", err)
            showToast({ variant: 'error', title: 'Lỗi', message: 'Không thể truy cập camera' })
            setQrLoading(false)
            setQrModalOpen(false)
        }
    }

    const startScanning = () => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        const context = canvas.getContext('2d', { willReadFrequently: true })

        scanIntervalRef.current = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.height = video.videoHeight
                canvas.width = video.videoWidth
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const code = jsQR(imageData.data, imageData.width, imageData.height)

                if (code) {
                    handleQRScanned(code.data)
                }
            }
        }, 250) // Tần suất quét tối ưu
    }

    const handleCloseModal = () => {
        setQrModalOpen(false);

        // Dừng tất cả các luồng camera đang chạy
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        // Reset file input để có thể chọn lại cùng 1 ảnh nếu muốn
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleQRScanned = async (qrString) => {
        if (!qrString) return;

        try {
            const qr = new QRPay(qrString);
            console.log("Parsed QR Object:", qr);

            if (qr.isValid) {
                const beneficiary = qr.consumer;
                setQrType(qr.initMethod === 11 ? 'static' : 'dynamic');
                const newData = {
                    ...formData,
                    destinationType: beneficiary?.bankNumber || formData.destinationType,
                    amount: qr.amount ? Number(qr.amount) : formData.amount,
                    description: qr.additionalData?.purpose || formData.description,
                    destinationBank: beneficiary?.bankBin || formData.destinationBank,
                    sourceTo: 'ACC',
                    sourceFrom: 'ACC'
                };
                setFormData(newData);
                handleCloseModal();
                await executeInquiry(newData);
                // showToast({ variant: 'success', title: 'Thành công', message: 'Đã nhận diện thông tin QR' });
            } else {
                showToast({ variant: 'error', title: 'Lỗi', message: 'Mã QR không đúng định dạng VietQR' });
            }
        } catch (error) {
            console.error("Lỗi parse QR:", error);
            showToast({ variant: 'error', title: 'Lỗi', message: 'Không thể xử lý mã QR này' });
        }
    };
    // Tự động chạy/tắt khi đóng mở Modal
    useEffect(() => {
        if (qrModalOpen) {
            initQRScanner()
        } else {
            stopCamera()
        }
        return () => stopCamera()
    }, [qrModalOpen])

    useEffect(() => {
        const fetchBanks = async () => {
            setFetchingBanks(true);
            try {
                const data = await apiClient.get('/bank'); // Nếu bạn đã cấu hình apiClient với baseURL thì chỉ cần endpoint tương đối  
                if (data && data.listBank) {
                    const formattedBanks = data.listBank.map(bank => ({
                        value: bank.id,
                        label: `${bank.id} - ${bank.name}`
                    }));
                    setBanks(formattedBanks);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ngân hàng:", error);
                showToast({ variant: 'error', title: 'Lỗi', message: 'Không thể tải danh sách ngân hàng' });
                setBanks(FALLBACK_BANKS.listBank.map(bank => ({
                    value: bank.id,
                    label: `${bank.id} - ${bank.name}`
                })));
            } finally {
                setFetchingBanks(false);
            }
        };

        fetchBanks();
    }, []);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                // Tạo canvas tạm để vẽ ảnh và lấy dữ liệu điểm ảnh (ImageData)
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                // Sử dụng thư viện jsQR để giải mã
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // Gọi hàm xử lý logic VietQR đã viết ở các bước trước
                    handleQRScanned(code.data);
                } else {
                    showToast({
                        variant: 'error',
                        title: 'Lỗi',
                        message: 'Không tìm thấy mã QR trong ảnh này'
                    });
                }
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const fetchInquiry = async (params) => {
        if (!params.creditorAgent || !params.toAccount) return null;
        const response = await apiClient.get('/payment/investigatename', { params });
        return response;
    };
    const executeInquiry = async (overrideData = null) => {
        // Ưu tiên lấy data truyền vào trực tiếp (dùng cho QR scan), 
        // nếu không có thì lấy từ state hiện tại (dùng cho onBlur)
        const currentData = overrideData || formData;

        const { destinationBank, destinationType, sourceTo, sourceFrom } = currentData;

        // Validation nhanh
        if (!destinationBank || !destinationType || !sourceTo || !sourceFrom) return;

        setInquiryLoading(true);
        try {
            const response = await fetchInquiry({
                creditorAgent: destinationBank,
                toAccount: destinationType,
                toAccountType: sourceTo,
                fromAccountType: sourceFrom
            });
            console.log("Response from Inquiry API:", response);
            if (response?.f39 === "00") {
                setFormData(prev => ({
                    ...prev,
                    beneficiaryName: response.f120, // Tên người thụ hưởng
                    transactionRef: response.f63    // Lưu mã F63 vào state mới
                }));

                showToast({
                    variant: 'success',
                    title: 'Thành công',
                    message: `Tên người thụ hưởng: ${response.f120}`
                });
            } else {
                // Reset dữ liệu nếu lỗi
                setFormData(initalFormData);
                showToast({
                    variant: 'error',
                    title: 'Lỗi truy vấn',
                    message: `Mã lỗi ${response?.f39}. Ref ${response?.f63}: Không tìm thấy thông tin.`
                });
            }
        } catch (error) {
            setFormData(initalFormData);
            console.error("Lỗi:", error);
        } finally {
            setInquiryLoading(false);
        }
    };
    const executeTransfer = async () => {
        // 1. Kiểm tra điều kiện trước khi chuyển tiền
        if (!formData.beneficiaryName || !formData.transactionRef) {
            showToast({
                title: 'Chưa xác thực',
                message: 'Vui lòng nhập số tài khoản và đợi xác thực tên người nhận trước khi chuyển tiền.',
                color: 'red'

            });
            return;
        }

        if (!formData.amount || formData.amount <= 0) {
            showToast({
                title: 'Lỗi',
                message: 'Vui lòng nhập số tiền hợp lệ',
                color: 'red'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.post('/payment/fundtransfer', {
                toAccount: formData.destinationType, // Số tài khoản nhận
                amount: formData.amount,             // Số tiền
                content: formData.description,       // Lý do
                f63: formData.transactionRef         // F63 từ kết quả vấn tin
            });
            if (response?.f39 === "00") {
                showToast({
                    title: 'Giao dịch thành công',
                    message: `Mã giao dịch: ${response.f11} - Ref: ${response.f63}`,
                    color: 'green',
                    icon: <IconCheck size={18} />,
                    autoClose: 10000,
                });

            } else {
                showToast({
                    title: 'Giao dịch thất bại',
                    message: `Lỗi: ${response?.f39}. Vui lòng thử lại.`,
                    color: 'red',
                    icon: <IconX size={18} />,
                });
            }
        } catch (error) {
            console.error("Lỗi chuyển tiền:", error);
            showToast({
                title: 'Lỗi hệ thống',
                message: 'Không thể thực hiện giao dịch. Vui lòng thử lại sau.',
                color: 'red'
            });
        } finally {
            setLoading(false);
            setFormData(initalFormData);
        }
    };
    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Paper withBorder shadow="md" p="xl" radius="lg">
                    <Stack gap="md">
                        <SimpleGrid cols={2} spacing="md">
                            <Stack gap={4}>
                                <Select
                                    label="Từ nguồn"
                                    placeholder="Chọn nguồn tiền"
                                    data={[
                                        { value: 'ACC', label: 'Tài khoản' },
                                        { value: 'PAN', label: 'Thẻ' },
                                    ]}
                                    value={formData.sourceFrom || ''}
                                    onChange={(val) => setFormData({ ...formData, sourceFrom: val || '' })}
                                    radius="md"
                                    size="md"
                                    leftSection={<IconWallet size={18} stroke={1.5} color="var(--mantine-color-violet-filled)" />}
                                />
                            </Stack>

                            <Select
                                label="Đến nguồn"
                                placeholder="Chọn đích đến"
                                data={[
                                    { value: 'ACC', label: 'Tài khoản' },
                                    { value: 'PAN', label: 'Thẻ' },
                                ]}
                                value={formData.sourceTo || ''}
                                onChange={(val) => setFormData({ ...formData, sourceTo: val || '' })}
                                radius="md"
                                size="md"
                                leftSection={<IconArrowRightCircle size={18} stroke={1.5} color="var(--mantine-color-gray-6)" />}
                            />
                        </SimpleGrid>
                        <Stack gap={6}>
                            <Select
                                label="Ngân hàng nhận"
                                placeholder={fetchingBanks ? "Đang tải danh sách..." : "Chọn ngân hàng nhận"}
                                data={banks}
                                rightSection={fetchingBanks ? <Loader size="xs" /> : null}
                                disabled={fetchingBanks}
                                value={formData.destinationBank || ''}
                                onChange={(val) => setFormData({ ...formData, destinationBank: val || '' })}
                                radius="md"
                                size="md"
                                searchable
                                leftSection={<IconBuildingBank size={18} color="var(--mantine-color-violet-filled)" />}
                            />
                        </Stack>
                        <TextInput
                            label="Số tài khoản/ Thẻ nhận"
                            placeholder="Nhập hoặc quét mã QR"
                            required
                            leftSection={<IconSearch size={18} />}
                            rightSection={inquiryLoading ? <Loader size="xs" /> : null}
                            value={formData.destinationType || ''}
                            onChange={(e) => setFormData({ ...formData, destinationType: e.target.value })}
                            radius="md"
                            size="md"
                            disabled={qrType === 'dynamic'} // Nếu là QR động, không cho phép chỉnh sửa thủ công
                            onBlur={() => executeInquiry()}
                        />
                        <Stack gap={4}>
                            <TextInput
                                label="Tên người thụ hưởng"
                                value={formData.beneficiaryName || ''}
                                readOnly
                                placeholder="Tên người thụ hưởng"
                                radius="md"
                                size="md"
                                variant="filled"
                                leftSection={<IconShieldCheck size={18} color={formData.beneficiaryName ? "green" : "gray"} />}
                                styles={(theme) => ({
                                    input: {
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        backgroundColor: 'var(--mantine-color-violet-light)',
                                        color: 'var(--mantine-color-violet-filled)',
                                        border: '1px solid var(--mantine-color-violet-light-hover)',
                                    },
                                })}
                            />
                            {formData.beneficiaryName && (
                                <Group gap={4} pl={5}>
                                    <Text size="xs" c="green.8" fw={500}>✓ Đã xác thực qua Napas</Text>
                                </Group>
                            )}
                        </Stack>
                        {formData.beneficiaryName && (
                            <Stack gap={4}>
                                <TextInput
                                    label="Mã tham chiếu | F63"
                                    placeholder="F63"
                                    rightSection={inquiryLoading ? <Loader size="xs" /> : null}
                                    value={formData.f63 || ''}
                                    radius="md"
                                    size="md"
                                    disabled
                                />
                            </Stack>
                        )}
                        <Stack gap={8}>
                            <NumberInput
                                label="Số tiền"
                                placeholder="0"
                                value={formData.amount}
                                onChange={(val) => setFormData({ ...formData, amount: val })}
                                thousandSeparator=","
                                suffix=" VND"
                                hideControls
                                radius="md"
                                size="md"
                                allowNegative={false}
                                styles={{
                                    input: {
                                        fontWeight: 700,
                                        color: 'var(--mantine-color-green-filled)',
                                        fontSize: '1.1rem'
                                    }
                                }}
                                disabled={qrType === 'dynamic'} // Nếu là QR động, không cho phép chỉnh sửa thủ công
                            />
                        </Stack>
                        <TextInput
                            label="Nội dung"
                            placeholder="Nội dung"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            radius="md"
                            size="md"
                            disabled={qrType === 'dynamic'} // Nếu là QR động, không cho phép chỉnh sửa thủ công
                        />

                        <Divider my="sm" />
                        <Group grow>
                            <Button
                                variant="subtle"
                                color="gray"
                                leftSection={<IconQrcode size={18} />}
                                onClick={() => setQrModalOpen(true)}
                                radius="md"
                                size="md"
                            >
                                Quét QR
                            </Button>
                            <Button
                                color="violet"
                                loading={loading}
                                onClick={() => executeTransfer()}
                                radius="md"
                                size="md"
                                leftSection={<IconSend size={18} />}
                                disabled={!formData.beneficiaryName || inquiryLoading}
                                style={{
                                    boxShadow: formData.beneficiaryName ? '0 8px 15px rgba(103, 65, 217, 0.3)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Xác nhận chuyển tiền
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </Stack>

            <Modal
                opened={qrModalOpen}
                onClose={handleCloseModal}
                title="Quét mã giao dịch"
                centered
                size="md"
                radius="lg"
            >
                <Stack>
                    <div style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        background: '#000'
                    }}>
                        <video
                            ref={videoRef}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            playsInline
                            muted
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {qrLoading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.7)',
                                zIndex: 5
                            }}>
                                <Loader size="sm" />
                            </div>
                        )}

                        <div style={{
                            position: 'absolute',
                            inset: '50px',
                            border: '2px solid #7950f2',
                            borderRadius: '12px',
                            pointerEvents: 'none' // Để không chặn thao tác click phía dưới
                        }} />
                    </div>

                    <Button
                        fullWidth
                        variant="light"
                        color="blue"
                        leftSection={<IconUpload size={16} />}
                        // Khi bấm nút này, nó sẽ "kích hoạt" click vào input ẩn bên dưới
                        onClick={() => fileInputRef.current.click()}
                    >
                        Tải ảnh QR từ thư viện
                    </Button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Stack>
            </Modal>
        </Container>
    );
}