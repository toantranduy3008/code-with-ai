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
