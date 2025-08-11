document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const adBtn = document.getElementById('ad-btn');
    const saveBtn = document.getElementById('save-btn');
    const previewImg = document.getElementById('preview-img');
    const canvas = document.getElementById('rotation-canvas');
    const ctx = canvas.getContext('2d');
    
    let originalImage = null;
    let rotationAngle = 0;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    rotationAngle = 0;
                    previewImg.src = originalImage.src;
                    previewImg.style.display = 'block';
                    drawRotatedImage();
                    saveBtn.disabled = true; // Disable save on new image
                };
                originalImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    rotateRightBtn.addEventListener('click', () => {
        if (!originalImage) return;
        rotationAngle += 90;
        if (rotationAngle >= 360) rotationAngle = 0;
        drawRotatedImage();
    });

    rotateLeftBtn.addEventListener('click', () => {
        if (!originalImage) return;
        rotationAngle -= 90;
        if (rotationAngle < 0) rotationAngle = 270;
        drawRotatedImage();
    });

    adBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please select a picture first.');
            return;
        }
        alert('Ad is playing...');
        setTimeout(() => {
            alert('Ad finished! You can now save your picture.');
            saveBtn.disabled = false;
        }, 3000);
    });

    saveBtn.addEventListener('click', () => {
        if (!originalImage) return;
        
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'pictrify-rotated.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function drawRotatedImage() {
        const rad = rotationAngle * Math.PI / 180;
        const w = originalImage.width;
        const h = originalImage.height;

        if (rotationAngle === 90 || rotationAngle === 270) {
            canvas.width = h;
            canvas.height = w;
        } else {
            canvas.width = w;
            canvas.height = h;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(originalImage, -w / 2, -h / 2, w, h);
        ctx.restore();
    }
});
