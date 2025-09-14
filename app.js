const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let overlayImg = new Image();
let overlaySrc = '';
let overlayScale = 0.7;
let overlayOffY = -0.05; // relative to video height

// get stream
async function startCamera(){
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
    await video.play();
    canvas.width = video.videoWidth || 360;
    canvas.height = video.videoHeight || 640;
    requestAnimationFrame(draw);
  } catch(err){
    alert('Không thể truy cập camera: ' + err.message);
  }
}

function draw(){
  if(video.readyState >= 2){
    // draw video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // draw overlay if loaded
    if(overlayImg && overlayImg.complete && overlaySrc){
      // scale overlay relative to width
      const w = canvas.width * overlayScale;
      const h = overlayImg.height / overlayImg.width * w;

      const x = (canvas.width - w) / 2;
      const y = canvas.height * overlayOffY; // negative => move up

      ctx.drawImage(overlayImg, x, y, w, h);
    }
  }
  requestAnimationFrame(draw);
}

// thumbnail buttons
document.querySelectorAll('.thumb').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const src = btn.dataset.src;
    if(!src){
      overlaySrc = '';
      overlayImg = null; // stop drawing overlay
      return;
    }
    overlayImg = new Image();
    overlayImg.onload = ()=> { overlaySrc = src; }  // chỉ update overlaySrc khi ảnh load xong
    overlayImg.src = src;
  });
});


// sliders
document.getElementById('scale').addEventListener('input', (e)=>{
  overlayScale = parseFloat(e.target.value);
});
document.getElementById('offY').addEventListener('input', (e)=>{
  overlayOffY = parseFloat(e.target.value);
});

startCamera();
