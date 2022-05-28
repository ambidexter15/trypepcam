let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont")
let captBtnCont = document.querySelector(".capture-btn-cont")
let recordBtn = document.querySelector(".record-btn")
let captBtn = document.querySelector(".capture-btn")
let timer = document.querySelector(".timer")
let recorder;
let recordFlag = false;
let transparentColor = "transparent"

let constraint = {
    video : false,  //true
    audio : false   //true
}

navigator.mediaDevices.getUserMedia(constraint)
.then((stream) => {
  video.srcObject = stream;

   recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", (e) => {
    chunks = [];
  })

 recorder.addEventListener("dataavailable", (e) => {
   chunks.push(e.data);
 })

 
 recorder.addEventListener("stop", (e) => {
  //download the video 
  let blob = new Blob(chunks, {type: "video/mp4"})
  let videoURL = URL.createObjectURL(blob);

  if(db)
  {
    let videoID = 1234;
    let dbTransaction = db.transaction("video","readwrite");
    let videoStorage = dbTransaction.objectStore("video");
    let videoEntry = {
      id : videoID,
      blobData : blob
    }
    videoStorage.add(videoEntry);
  }
  // let a = document.createElement("a");
  // a.href = videoURL
  // a.download = "recordvideo.mp4"
  // a.click();
  // recordBtnCont.appendChild(a);
})


})


recordBtnCont.addEventListener("click" , (e) => {
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag)
    {
      recorder.start();
      recordBtn.classList.add("anim-rec");
      startTimer();
    }

    else
    {
      recorder.stop();
      recordBtn.classList.remove("anim-rec");
      stopTimer();
    }

  
})

let counter =0;
let timerID;
function startTimer() {
 timer.style.display = "block"
  function displayTimer(){
     let totalSeconds = counter;
     let hours = Number.parseInt(totalSeconds / 3600);
     totalSeconds = totalSeconds % 3600;

     let minutes = Number.parseInt(totalSeconds / 60);
     totalSeconds = totalSeconds % 60;

     let seconds = totalSeconds;


   hours = (hours < 10 ) ? `0${hours}` : hours;
   minutes = (minutes < 10 ) ? `0${minutes}` : minutes;
   seconds = (seconds < 10 ) ? `0${seconds}` : seconds;

   timer.innerText = `${hours}:${minutes}:${seconds}`
   counter++;
   
  }

  timerID = setInterval(displayTimer, 1000)

}

function stopTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00"
  timer.style.display = "none";
  
}

captBtnCont.addEventListener("click",(e) => {
  captBtn.classList.add(".anim-cap")
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
 
  let tool= canvas.getContext("2d")
  tool.drawImage(video,0, 0, canvas.width, canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0,0,canvas.width, canvas.height)

  let imageURL = canvas.toDataURL();


  if(db)
  {
    let imageID = 1234;
    let dbTransaction = db.transaction("image","readwrite");
    let imageStorage = dbTransaction.objectStore("image");
    let imageEntry = {
      id : imageID,
      URL : imageURL
    }
    imageStorage.add(imageEntry);
  }
  // let a = document.createElement("a");
  // a.href = imageURL
  // a.download = "captureimage.jpg"
  // a.click();
  
  setTimeout(()=> {
    captBtn.classList.remove(".anim-cap")
  },500)


})

let allfilters = document.querySelectorAll(".filter")
let filterLayer = document.querySelector(".filter-layer")
allfilters.forEach((filterElem) =>
{
  filterElem.addEventListener("click", (e) => {
    transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color")
    filterLayer.style.backgroundColor = transparentColor;

  }
  )
})