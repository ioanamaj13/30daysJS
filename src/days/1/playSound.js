//Oscillator
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.type = "sine";
oscillator.connect(audioContext.destination);
oscillator.start();
let oscillatorGlobalFrequency = 220;

//Buttons
const allowSoundBtn = document.getElementsByClassName("allowSound")[0];
const startBtn = document.getElementsByClassName("playSound")[0];
const stopBtn = document.getElementsByClassName("stopSound")[0];

//Info
const xInfo = document.getElementById("x");
const yInfo = document.getElementById("y");
const radiusInfo = document.getElementById("radius");

//Canvas
const canvas = document.getElementById("canvas");
const heightInfo = document.getElementById("canvasHeight");
const widthInfo = document.getElementById("canvasWidth");

let cHeight = window.innerHeight;
let cWidth = window.innerWidth;

const ctx = canvas.getContext("2d");

ctx.canvas.width = cWidth;
ctx.canvas.height = cHeight;

// console.log("cWidth , cHeight: ", ctx.canvas.width, ctx.canvas.height);

const drawCircle = (x, y, radius) => {
  console.log("drawCircle: ", x, y, radius);

  console.log("radius: ", radius);
  console.log('cw: ', cWidth);

  if (radius > cWidth / 2) {
    radius = Math.random() * cWidth / 2;
  }
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

allowSoundBtn.addEventListener("click", function () {
  console.log("playSound.js: allowSound clicked");
  audioContext.resume();
});

startBtn.addEventListener("click", function () {
  console.log("playSound.js: startButton clicked");
  oscillator.connect(audioContext.destination);
  audioContext.resume();
});

stopBtn.addEventListener("click", function () {
  console.log("playSound.js: stopButton clicked");
  oscillator.disconnect(audioContext.destination);
});

const setCanvasInfo = (height, width) => {
  heightInfo.innerHTML = height;
  widthInfo.innerHTML = width;
};

const setCircleInfo = (x, y, radius) => {
  xInfo.innerHTML = x;
  yInfo.innerHTML = y;
  radiusInfo.innerHTML = radius || 50;
};

setCircleInfo(cWidth / 2, cHeight / 2, oscillatorGlobalFrequency);
setCanvasInfo(cHeight, cWidth);

const generateColor = (oscillatorGlobalFrequency, type = "hsla") => {
  if (type === "hsla") {
    if (oscillatorGlobalFrequency > 360) {
      oscillatorGlobalFrequency = Math.random() * 360;
    }
  }

  //RGB
  let red = Math.random() * 255;
  let green = Math.random() * 255;
  let blue = Math.random() * 255;

  const colorVariation = Math.random() * 3;

  switch (Math.floor(colorVariation)) {
    case 0:
      {
        red = oscillatorGlobalFrequency;
      }
      break;
    case 1:
      {
        green = oscillatorGlobalFrequency;
      }
      break;
    case 2:
      {
        blue = oscillatorGlobalFrequency;
      }
      break;
  }

  //HSL

  const hue = oscillatorGlobalFrequency / 2;
  const saturation = Math.random() * 50 + 50;
  const lightness = Math.random() * 50 + 20;

  const color = `rgb(${red}, ${green}, ${blue})`;
  const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

  console.log("hslaColor: ", hslaColor);
  console.log("color: ", color);

  if (type === "hsla") {
    return hslaColor;
  } else {
    return color;
  }
};

document.addEventListener("keydown", function (event) {
  generateColor(oscillatorGlobalFrequency);

  // ctx.strokeStyle = "black";
  ctx.lineWidth = oscillatorGlobalFrequency / 100 + 1;
  ctx.shadowBlur = oscillatorGlobalFrequency / 100;
  ctx.shadowColor = generateColor(oscillatorGlobalFrequency);
  ctx.filter = `blur(${oscillatorGlobalFrequency / 100}px)`;
  // ctx.rotate(((oscillatorGlobalFrequency / 100) * Math.PI) / 180);

  console.log(event);
  let oscillatorFrequency = 110 * Math.pow(2, (event.which - 49) / 12);

  if (oscillatorFrequency > 23000) {
    console.log("playSound.js: frequency out of range");
    oscillatorFrequency = Math.ceil(oscillatorFrequency / 23000);
  }

  if (oscillatorFrequency < 20) {
    oscillatorFrequency = 220;
  }

  oscillatorGlobalFrequency = oscillatorFrequency;

  setCircleInfo(cWidth / 2, cHeight / 2, oscillatorGlobalFrequency);

  oscillator.frequency.value = oscillatorFrequency;
  oscillator.connect(audioContext.destination);

  const variation = Math.random() * 100;
  console.log("variation: ", variation);

  drawCircle(cWidth / 2, cHeight / 2 + variation, oscillatorGlobalFrequency);
  drawCircle(cWidth / 2 + variation, cHeight / 2, oscillatorGlobalFrequency);

  if (event.code === "Escape") {
    oscillator.disconnect(audioContext.destination);
  }
});

const resizeCanvas = () => {
  const { width, height } = canvas.getBoundingClientRect();
  cHeight = height;
  cWidth = width;

  setCanvasInfo(cHeight, cWidth);
  setCircleInfo(cWidth / 2, cHeight / 2, oscillatorGlobalFrequency);

  console.log("cWidth , cHeight: ", cWidth, cHeight);
  console.log("radius: ", radius);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

window.addEventListener("resize", resizeCanvas, false);
