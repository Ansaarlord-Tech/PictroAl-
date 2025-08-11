document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const watchAdBtn = document.getElementById('watch-ad-btn');
    const saveBtn = document.getElementById('save-btn');
    const statusMessage = document.getElementById('status-message');
    const convertOptions = document.getElementById('convert-options');
    
    const previewContainer = document.getElementById('preview-container');
    const originalPreview = document.getElementById('original-image-preview');

    let isAdWatchedSuccessfully = false;
    let uploadedImage = null;

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadedImage = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                originalPreview.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
            
            isAdWatchedSuccessfully = false;
            saveBtn.disabled = true;
            watchAdBtn.style.display = 'block';
            statusMessage.textContent = '';
        }
    });

    watchAdBtn.addEventListener('click', () => {
        if (!uploadedImage) {
            statusMessage.textContent = 'Please upload an image first.';
            statusMessage.style.color = 'red';
            return;
        }

        statusMessage.textContent = 'Ad is playing...';
        statusMessage.style.color = '#007bff';
        watchAdBtn.disabled = true;

        setTimeout(() => {
            const adSuccess = Math.random() > 0.3;
            if (adSuccess) {
                isAdWatchedSuccessfully = true;
                saveBtn.disabled = false;
                watchAdBtn.style.display = 'none';
                statusMessage.textContent = 'Ad watched successfully! You can now save your image.';
                statusMessage.style.color = 'green';
            } else {
                isAdWatchedSuccessfully = false;
                saveBtn.disabled = true;
                watchAdBtn.disabled = false;
                statusMessage.textContent = 'Ad failed to load. Please try again.';
                statusMessage.style.color = 'red';
            }
        }, 3000);
    });

    saveBtn.addEventListener('click', () => {
        if (!isAdWatchedSuccessfully) {
            statusMessage.textContent = 'Please watch the ad first to enable the save button.';
            statusMessage.style.color = 'red';
            return;
        }

        const format = convertOptions.value;

        statusMessage.textContent = 'Preparing download...';
        statusMessage.style.color = '#007bff';

        setTimeout(() => {
            const a = document.createElement('a');
            a.href = originalPreview.src;
            a.download = `pictroai-converted.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            statusMessage.textContent = 'File downloaded successfully!';
            statusMessage.style.color = 'green';

            isAdWatchedSuccessfully = false;
            saveBtn.disabled = true;
            watchAdBtn.style.display = 'block';
        }, 1500);
    });
});
