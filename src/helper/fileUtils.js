import { showToast } from "../config/toast";

export const getFileBase64 = async (file) => {
    try {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = reject
        })
    } catch (error) {
        showToast({
            variant: 'error',
            title: 'Lỗi',
            message: `Không thể xử lý file: ${error.message || 'Lỗi không xác định'}`,
        });
    }
}
export const generateFileAttachment = async (file) => {
    try {
        console.log("Generating file attachment for:", file);

        // Nếu không có file truyền vào, trả về mảng rỗng ngay
        if (!file) return [];

        // Lấy binary base64 của file duy nhất
        const binary = await getFileBase64(file);

        // Xử lý cắt chuỗi base64
        const subStringStartPoint = binary.toString().indexOf(';base64,') + ';base64,'.length;
        const binaryWithoutEncodeType = binary.substring(subStringStartPoint, binary.length);

        // Tạo object kết quả
        const fileData = {
            fileName: file.name,
            mimeType: file.type,
            charSet: 'utf-8',
            encodeType: 'base64',
            fileBinary: binaryWithoutEncodeType
        };

        // Trả về mảng chứa 1 phần tử duy nhất
        return [fileData];

    } catch (error) {
        showToast({
            variant: 'error',
            title: 'Lỗi',
            message: `Không thể xử lý file đính kèm: ${error.message || 'Lỗi không xác định'}`,
        });
        return [];
    }
}