const typeButtons = document.querySelectorAll('.type-btn');
const contentInput = document.getElementById('content');
const charCountSpan = document.getElementById('char-count');
const qrImage = document.getElementById('qr-image');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const messageDiv = document.getElementById('message');

let currentType = 'text';
let qrCodeUrl = '';

// Type button event listeners
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        typeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentType = button.dataset.type;
        contentInput.placeholder = getPlaceholder(currentType);
        contentInput.value = '';
        charCountSpan.textContent = '0';
        qrImage.src = '';
        qrImage.classList.remove('active');
        messageDiv.textContent = '';
    });
});

// Character count
contentInput.addEventListener('input', () => {
    charCountSpan.textContent = contentInput.value.length;
    updateQRCode();
});

// Generate QR code
function updateQRCode() {
    const content = contentInput.value.trim();
    if (!content) {
        qrImage.src = '';
        qrImage.classList.remove('active');
        return;
    }
    
    const encodedContent = encodeURIComponent(formatContent(content, currentType));
    qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodedContent}`;
    
    qrImage.src = qrCodeUrl;
    qrImage.classList.add('active');
}

function formatContent(content, type) {
    switch(type) {
        case 'url':
            return content.startsWith('http') ? content : 'https://' + content;
        case 'email':
            return `mailto:${content}`;
        case 'phone':
            return `tel:${content}`;
        case 'sms':
            return `smsto:${content}`;
        case 'geo':
            return `geo:${content}`;
        case 'wifi':
            return content;
        case 'vcard':
            return content;
        default:
            return content;
    }
}

function getPlaceholder(type) {
    const placeholders = {
'輸入QR碼中要呈現的文字'        'url': '輸入網址 (e.g., example.com)',
        'email': '輸入郵件地址',
        'phone': '輸入電話號碼',
        'sms': '輸入電話號碼',
        'geo': '輸入座標 (lat,lng)',
        'wifi': '輸入 WiFi 設定',
'輸入联絡人資訊'    };
    return placeholders[type] || '輸入內容...';
}

// Download button
downloadBtn.addEventListener('click', () => {
    if (!qrCodeUrl) {
        messageDiv.textContent = '請先輸入內容以生成 QR碼';
        messageDiv.style.color = '#f44336';
        return;
    }
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    messageDiv.textContent = '\u4e0b載成功!';
    messageDiv.style.color = '#4CAF50';
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 2000);
});

// Copy button
copyBtn.addEventListener('click', () => {
    if (!qrCodeUrl) {
        messageDiv.textContent = '請先輸入內容以生成 QR碼';
        messageDiv.style.color = '#f44336';
        return;
    }
    
    navigator.clipboard.writeText(qrCodeUrl).then(() => {
        messageDiv.textContent = '連結已複製!';
        messageDiv.style.color = '#4CAF50';
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 2000);
    }).catch(err => {
        messageDiv.textContent = '複製失敗';
        messageDiv.style.color = '#f44336';
    });
});

// Initialize
contentInput.placeholder = getPlaceholder('text');
