const userVideo = document.getElementById("user-video");
window.addEventListener("load", async (e) => {
  const media = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  userVideo.srcObject = media;
});
