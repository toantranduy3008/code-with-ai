/**
 * QR Code Scanner Utility
 * Optional: Install jsQR for better QR code detection
 * npm install jsqr
 */

// Import jsQR if available (optional dependency)
// import jsQR from 'jsqr'

/**
 * Detect QR code from canvas context
 * Note: This requires jsQR library to be installed
 */
export const detectQRCode = (imageData) => {
    try {
        // Uncomment if jsQR is installed
        // const code = jsQR(imageData.data, imageData.width, imageData.height)
        // if (code) {
        //     return code.data
        // }
        return null
    } catch (error) {
        console.error('QR detection error:', error)
        return null
    }
}

/**
 * Parse QR code data
 * Expected format: JSON string with transaction details
 * Example: {"destinationBank":"vietcombank","amount":"500000","description":"Thanh toán"}
 */
export const parseQRData = (qrData) => {
    try {
        if (typeof qrData === 'string') {
            const data = JSON.parse(qrData)
            return {
                destinationBank: data.destinationBank || null,
                sourceBank: data.sourceBank || null,
                destinationType: data.destinationType || null,
                sourceType: data.sourceType || null,
                amount: data.amount ? data.amount.toString() : '',
                description: data.description || '',
            }
        }
        return null
    } catch (error) {
        console.error('QR data parse error:', error)
        return null
    }
}

/**
 * Validate QR code format
 */
export const isValidQRData = (data) => {
    return (
        data &&
        (data.amount || data.destinationBank || data.description)
    )
}

// Hàm tìm và lấy toàn bộ chuỗi gốc của ID 62 từ chuỗi QR tổng
export const extractRawId62 = (qrString) => {
    if (!qrString) return '';
    let index = 0;
    while (index < qrString.length) {
        const tag = qrString.substring(index, index + 2);
        const lengthStr = qrString.substring(index + 2, index + 4);
        if (!tag || !lengthStr) break;

        const length = parseInt(lengthStr, 10);
        const value = qrString.substring(index + 4, index + 4 + length);

        if (tag === '62') {
            // Trả về nguyên cụm TLV của ID 62 (ví dụ: 62480308DCIEDUVN...)
            return qrString.substring(index, index + 4 + length);
        }
        index += 4 + length;
    }
    return '';
};
