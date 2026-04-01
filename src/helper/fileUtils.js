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
export const generateFileAttachment = async (listFiles) => {
    try {
        let fileAttachment;
        let result = []
        fileAttachment = listFiles.map(async (item, index) => {
            const binary = await getFileBase64(listFiles[index])
            const subStringStartPoint = binary.toString().indexOf(';base64,') + ';base64,'.length
            const binaryWithoutEncodeType = binary.substring(subStringStartPoint, binary.length)
            return {
                fileName: item.name,
                mimeType: item.type,
                charSet: 'utf-8',
                encodeType: 'base64',
                fileBinary: binaryWithoutEncodeType
            }
        })

        for (let index = 0; index < fileAttachment.length; index++) {
            const element = await fileAttachment[index];
            result.push(element)
        }

        return result
    } catch (error) {
        showToast({
            variant: 'error',
            title: 'Lỗi',
            message: `Không thể xử lý file đính kèm: ${error.message || 'Lỗi không xác định'}`,
        });
        return [];
    }
}