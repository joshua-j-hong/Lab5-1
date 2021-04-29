// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
let ctx = canvas.getContext('2d');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  ctx.clearRect(0,0, canvas.width, canvas.height);

  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;

  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas.width, canvas.height);

  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const imageInput = document.getElementById("image-input");

// Listener for new image upload
imageInput.addEventListener('change', () => {
  console.log(imageInput.files.length);
  console.log(imageInput.files[0]);
  console.log(imageInput.files[0].name);
  img.src = URL.createObjectURL(imageInput.files[0]);
  img.alt = imageInput.files[0].name;
});

// Listener for text submission
document.getElementById("generate-meme").addEventListener('submit', function(event) {
  document.querySelector("[type='submit']").disabled = true;
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = 'white';
  ctx.font = '36px sans-serif';
  ctx.fillText(document.getElementById("text-top").value, canvas.width / 2, canvas.height / 8);
  ctx.fillText(document.getElementById("text-bottom").value, canvas.width / 2, canvas.height - canvas.height / 8);
  event.preventDefault();
}, false);

// Listener for canvas reset
document.querySelector("[type='reset']").addEventListener('click', () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas.width, canvas.height);
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
});

// Listener for populating available synth voices
let synth = window.speechSynthesis;
synth.addEventListener('voiceschanged', () => {
  let voiceSelect = document.getElementById("voice-selection");
  voiceSelect.disabled = false;
  voiceSelect.remove(0);
  synth.getVoices().forEach( function(voice) {
    let option = document.createElement("option");
    option.text = voice.name;
    voiceSelect.add(option);
  });
});

let volume = 1;

// Listener for synth text reading
document.querySelector("[type='button']").addEventListener('click', () => {
  let top = new SpeechSynthesisUtterance(document.getElementById("text-top").value);
  let bottom = new SpeechSynthesisUtterance(document.getElementById("text-bottom").value);

  let selectedVoice = synth.getVoices()[document.getElementById("voice-selection").selectedIndex];
  top.voice = selectedVoice;
  top.volume = volume;
  bottom.voice = selectedVoice;
  bottom.volume = volume;

  synth.speak(top);
  synth.speak(bottom);
});

// Listener for changing volume of synth
document.querySelector("[type='range']").addEventListener("input", () => {
  volume = document.querySelector("[type='range']").value / 100;
  let volumeImage = document.querySelector("#volume-group > img");
  if (volume >= 0.67) {
    volumeImage.src = "icons/volume-level-3.svg";
    volumeImage.alt = "Volume Level 3";
  } else if ( volume >= 0.34) {
    volumeImage.src = "icons/volume-level-2.svg";
    volumeImage.alt = "Volume Level 2";
  } else if ( volume >= 0.01) {
    volumeImage.src = "icons/volume-level-1.svg";
    volumeImage.alt = "Volume Level 1";
  } else {
    volumeImage.src = "icons/volume-level-0.svg";
    volumeImage.alt = "Volume Level 0";
  }
});



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
