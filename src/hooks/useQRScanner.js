import { useRef, useState, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';
import { QRPay } from 'vietnam-qr-pay';
import { showToast } from '../config/toast';

export const useQRScanner = (onQRScanned) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);
    const [qrLoading, setQrLoading] = useState(false);

    // 1. Dùng Ref để lưu callback mới nhất mà không kích hoạt re-render scanner
    const onQRScannedRef = useRef(onQRScanned);
    useEffect(() => {
        onQRScannedRef.current = onQRScanned;
    }, [onQRScanned]);

    const stopCamera = useCallback(() => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
    }, []);

    // 2. Tách logic xử lý QR ra khỏi dependency của scanner
    const processQR = useCallback((qrString) => {
        if (!qrString) return;
        try {
            const qr = new QRPay(qrString);
            if (qr.isValid) {
                onQRScannedRef.current(qr);
            } else {
                showToast({
                    variant: 'error',
                    title: 'Lỗi',
                    message: 'Mã QR không đúng định dạng VietQR'
                });
            }
        } catch (error) {
            console.error("Lỗi parse QR:", error);
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Không thể xử lý mã QR này'
            });
        }
    }, []); // Hook này giờ không phụ thuộc vào gì cả

    // 3. startScanning bây giờ sẽ "tĩnh", không bao giờ bị khởi tạo lại
    const startScanning = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const context = canvas.getContext('2d', { willReadFrequently: true });

        // Xóa interval cũ nếu có để tránh chạy song song
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

        scanIntervalRef.current = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    processQR(code.data);
                }
            }
        }, 250);
    }, [processQR]);

    const initQRScanner = useCallback(async () => {
        setQrLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;

            // Thay vì dùng setInterval để check Ref, ta dùng trực tiếp logic
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        setQrLoading(false);
                        startScanning();
                    });
                };
            }
        } catch (err) {
            console.error("Camera Error:", err);
            showToast({
                variant: 'error',
                title: 'Lỗi',
                message: 'Không thể truy cập camera'
            });
            setQrLoading(false);
        }
    }, [startScanning]);

    const handleFileUpload = useCallback((event, fileInputRef) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    processQR(code.data);
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

        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [processQR]);

    return {
        videoRef,
        canvasRef,
        qrLoading,
        initQRScanner,
        stopCamera,
        handleFileUpload
    };
};