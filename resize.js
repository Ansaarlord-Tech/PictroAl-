document.addEventListener('DOMContentLoaded', () => {
    // =======================================================
    // YOUR BANNER AD CODE - This will load the banner ad when the page starts.
    //
    // REPLACE 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY' WITH YOUR BANNER AD UNIT ID
    const bannerAdUnitId = 'ca-app-pub-6721840281514656/8852212562';

    const bannerAdContainer = document.getElementById('banner-ad-container');
    if (bannerAdContainer) {
        // Here you would use your AdMob SDK to load the banner ad
        // adMob.loadBannerAd({ adUnitId: bannerAdUnitId, container: bannerAdContainer });
        
        // Simulating a banner ad for demonstration
        bannerAdContainer.innerHTML = '<div style="background-color: lightgray; height: 50px; text-align: center; line-height: 50px;">Banner Ad Here</div>';
    }
    // =======================================================
    
    const imageUpload = document.getElementById('image-upload');
    const watchAdBtn = document.getElementById('watch-ad-btn');
    const saveBtn = document.getElementById('save-btn');
    const statusMessage = document.getElementById('status-message');
    const resizeOptions = document.getElementById('resize-options');
    const customResizeContainer = document.getElementById('custom-resize-container');
    const customWidthInput = document.getElementById('custom-width');
    const customHeightInput = document.getElementById('custom-height');
    
    const previewContainer = document.getElementById('preview-container');
    const originalPreview = document.getElementById('original-image-preview');

    let isAdWatchedSuccessfully = false;
    let uploadedImage = null;
    let fileUrl = null;

    resizeOptions.addEventListener('change', () => {
        if (resizeOptions.value === 'custom') {
            customResizeContainer.style.display = 'block';
        } else {
            customResizeContainer.style.display = 'none';
        }
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadedImage = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                originalPreview.src = e.target.result;
                previewContainer.style.display = 'block';
                fileUrl = e.target.result;
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

        statusMessage.textContent = 'Ad is loading...';
        statusMessage.style.color = '#007bff';
        watchAdBtn.disabled = true;

        // =======================================================
        // YOUR REWARDED AD CODE
        //
        const adMobAdUnitId = 'ca-app-pub-6721840281514656/9315246993';
        
        // This is a simulated ad loading and showing process.
        adMob.loadAd({ adUnitId: adMobAdUnitId })
            .then(() => {
                adMob.showAd({ adUnitId: adMobAdUnitId })
                    .then(rewarded => {
                        isAdWatchedSuccessfully = true;
                        saveBtn.disabled = false;
                        watchAdBtn.style.display = 'none';
                        statusMessage.textContent = 'Ad watched successfully! You can now save your image.';
                        statusMessage.style.color = 'green';
                    })
                    .catch(error => {
                        isAdWatchedSuccessfully = false;
                        saveBtn.disabled = true;
                        watchAdBtn.disabled = false;
                        statusMessage.textContent = 'Ad was not completed. Please try again.';
                        statusMessage.style.color = 'red';
                    });
            })
            .catch(error => {
                isAdWatchedSuccessfully = false;
                saveBtn.disabled = true;
                watchAdBtn.disabled = false;
                statusMessage.textContent = 'Ad failed to load. Please try again.';
                statusMessage.style.color = 'red';
            });
        // =======================================================
    });

    saveBtn.addEventListener('click', () => {
        if (!isAdWatchedSuccessfully) {
            statusMessage.textContent = 'Please watch the ad first to enable the save button.';
            statusMessage.style.color = 'red';
            return;
        }

        let width, height;
        const selectedSize = resizeOptions.value;

        if (selectedSize === 'custom') {
            width = parseInt(customWidthInput.value, 10);
            height = parseInt(customHeightInput.value, 10);
            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                statusMessage.textContent = 'Please enter valid numbers for custom width and height.';
                statusMessage.style.color = 'red';
                return;
            }
        } else {
            if (selectedSize === 'original') {
                statusMessage.textContent = 'Please select a new size or a custom size.';
                statusMessage.style.color = 'red';
                return;
            }
            const [w, h] = selectedSize.split('x');
            width = parseInt(w, 10);
            height = parseInt(h, 10);
        }

        statusMessage.textContent = 'Preparing download...';
        statusMessage.style.color = '#007bff';
        
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = `pictroai-resized-${width}x${height}.${uploadedImage.name.split('.').pop()}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        statusMessage.textContent = 'File downloaded successfully!';
        statusMessage.style.color = 'green';

        isAdWatchedSuccessfully = false;
        saveBtn.disabled = true;
        watchAdBtn.style.display = 'block';
    });
});
