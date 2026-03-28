import { Modal, Stack, Button, Loader } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useRef } from 'react';

export const QRScannerModal = ({ opened, onClose, qrLoading, videoRef, canvasRef, onFileUpload }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        onFileUpload(event, fileInputRef);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
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
                        pointerEvents: 'none'
                    }} />
                </div>

                <Button
                    fullWidth
                    variant="light"
                    color="blue"
                    leftSection={<IconUpload size={16} />}
                    onClick={handleFileSelect}
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
    );
};
