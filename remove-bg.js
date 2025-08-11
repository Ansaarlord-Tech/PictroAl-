document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const adBtn = document.getElementById('ad-btn');
    const saveBtn = document.getElementById('save-btn');
    const container = document.querySelector('.canvas-container');
    const bgCanvas = document.getElementById('bg-canvas');
    const drawCanvas = document.getElementById('draw-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    const drawCtx = drawCanvas.getContext('2d');

    let isDrawing = false;
    let originalImage = null;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    container.style.display = 'block';
                    bgCanvas.width = originalImage.width;
                    bgCanvas.height = originalImage.height;
                    drawCanvas.width = originalImage.width;
                    drawCanvas.height = originalImage.height;
                    bgCtx.drawImage(originalImage, 0, 0);
                    
                    drawCtx.lineJoin = 'round';
                    drawCtx.lineCap = 'round';
                    drawCtx.lineWidth = 30;
                    drawCtx.globalCompositeOperation = 'destination-out';
                    
                    saveBtn.disabled = true; // Disable save on new image
                };
                originalImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const getMousePos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(drawCanvas, e.type.startsWith('touch') ? e.touches[0] : e);
        drawCtx.lineTo(pos.x, pos.y);
        drawCtx.stroke();
    };

    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getMousePos(drawCanvas, e);
        drawCtx.beginPath();
        drawCtx.moveTo(pos.x, pos.y);
    });

    drawCanvas.addEventListener('mousemove', draw);
    drawCanvas.addEventListener('mouseup', () => isDrawing = false);
    drawCanvas.addEventListener('mouseleave', () => isDrawing = false);

    // Touch events for mobile
    drawCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getMousePos(drawCanvas, e.touches[0]);
        drawCtx.beginPath();
        drawCtx.moveTo(pos.x, pos.y);
    });
    
    drawCanvas.addEventListener('touchmove', draw);
    drawCanvas.addEventListener('touchend', () => isDrawing = false);

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

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = bgCanvas.width;
        finalCanvas.height = bgCanvas.height;
        const finalCtx = finalCanvas.getContext('2d');
        
        finalCtx.drawImage(bgCanvas, 0, 0);
        finalCtx.drawImage(drawCanvas, 0, 0);
        
        const dataURL = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'pictrify-removed-bg.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
