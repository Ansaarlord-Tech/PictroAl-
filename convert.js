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
    });watchAdBtn.addEventListener('click', () => {
    if (!uploadedImage) {
        statusMessage.textContent = 'Please upload an image first.';
        statusMessage.style.color = 'red';
        return;
    }

    statusMessage.textContent = 'Ad is loading...';
    statusMessage.style.color = '#007bff';
    watchAdBtn.disabled = true;

    // =======================================================
    // YOUR ADMOB CODE
    //
    // REPLACE 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY' WITH YOUR ACTUAL AD UNIT ID
    const adMobAdUnitId = 'ca-app-pub-6721840281514656/9315246993';
    
    // This is a simulated ad loading and showing process.
    // Your actual AdMob SDK will provide functions like this.
    // This example sets up event listeners for a rewarded ad.
    
    // Load the ad
    adMob.loadAd({ adUnitId: adMobAdUnitId })
        .then(() => {
            // Ad loaded successfully, now show it
            adMob.showAd({ adUnitId: adMobAdUnitId })
                .then(rewarded => {
                    // Ad was watched successfully
                    isAdWatchedSuccessfully = true;
                    saveBtn.disabled = false;
                    watchAdBtn.style.display = 'none';
                    statusMessage.textContent = 'Ad watched successfully! You can now save your image.';
                    statusMessage.style.color = 'green';
                })
                .catch(error => {
                    // Ad was not watched successfully (e.g., user closed it early)
                    isAdWatchedSuccessfully = false;
                    saveBtn.disabled = true;
                    watchAdBtn.disabled = false;
                    statusMessage.textContent = 'Ad was not completed. Please try again.';
                    statusMessage.style.color = 'red';
                });
        })
        .catch(error => {
            // Failed to load ad
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
