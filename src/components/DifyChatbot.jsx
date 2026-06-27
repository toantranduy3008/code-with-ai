import { useEffect } from 'react';

export default function DifyChatbot() {
    useEffect(() => {
        const scriptId = 'F2iaGu6lzc1J1luc';
        const styleId = 'dify-chatbot-custom-style';

        // 1. Định nghĩa cấu hình trên window toàn cục
        window.difyChatbotConfig = {
            token: 'F2iaGu6lzc1J1luc',
            baseUrl: 'https://ai-tckt.napas.com.vn',
            inputs: {},
            systemVariables: {},
            userVariables: {},
        };

        // 2. Inject Style đè cấu trúc hiển thị
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                #dify-chatbot-bubble-button {
                    background-color: #1C64F2 !important;
                    position: fixed !important;
                    bottom: 24px !important;
                    right: 24px !important;
                    z-index: 999999 !important;
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                #dify-chatbot-bubble-window {
                    width: 24rem !important;
                    height: 40rem !important;
                    position: fixed !important;
                    bottom: 90px !important;
                    right: 24px !important;
                    z-index: 999999 !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Hàm giả lập sự kiện load để kích hoạt code ẩn bên trong Dify embed
        const triggerScriptInitialization = () => {
            const existingButton = document.getElementById('dify-chatbot-bubble-button');
            if (existingButton) return; // Đã chạy rồi thì không chạy lại

            // Phát ra sự kiện load giả lập để đánh lừa mã nguồn Dify chạy hàm khởi tạo
            window.dispatchEvent(new Event('load'));
            document.dispatchEvent(new Event('DOMContentLoaded'));
        };

        // 3. Tiến hành kiểm tra và nạp Script
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.src = 'https://ai-tckt.napas.com.vn/embed.min.js';
            script.id = scriptId;
            script.async = true;
            script.onload = () => {
                setTimeout(triggerScriptInitialization, 100);
            };
            document.body.appendChild(script);
        } else {
            // Script đã có sẵn, giả lập kích hoạt luôn sau khi component mount
            setTimeout(triggerScriptInitialization, 200);
        }

        // 4. Dọn dẹp khi unmount (Chuyển trang khỏi Login)
        return () => {
            const isLeavingPage = !document.getElementById('root')?.contains(document.querySelector('.min-h-screen'));

            if (isLeavingPage) {
                const existingStyle = document.getElementById(styleId);
                if (existingStyle) existingStyle.remove();

                const bubbleBtn = document.getElementById('dify-chatbot-bubble-button');
                const bubbleWin = document.getElementById('dify-chatbot-bubble-window');
                if (bubbleBtn) bubbleBtn.remove();
                if (bubbleWin) bubbleWin.remove();
            }
        };
    }, []);

    return null;
}