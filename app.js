//SELECTORS and INITIALIZERS
const generateBtn = document.querySelector(".generate");
const colors = document.querySelectorAll(".color");
const hexColors = document.querySelectorAll(".color h2");
const sliders = document.querySelectorAll(".sliders");

let initialColors;

//EVENT LISTENERS
generateBtn.addEventListener("click", () => {
  randomizePalette();
});

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

//FUNCTIONS

//Hex color generator
function generateHexColor() {
  const hexColor = chroma.random();
  return hexColor;
}

//Randomize palette
function randomizePalette() {
  colors.forEach((div, index) => {
    const hexText = div.children[0];
    const randomHexColor = generateHexColor();

    div.style.backgroundColor = randomHexColor;
    hexText.innerText = randomHexColor;

    checkContrast(randomHexColor, hexText);

    //Set color sliders
    const color = chroma(randomHexColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(randomHexColor, hue, brightness, saturation);
  });
}
//Calling the function sets the initial palette
randomizePalette();

//Uses chroma.js to check contrast
//change text to black or white
function checkContrast(color, text) {
  const value = chroma(color).luminance();
  if (value > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

//Colorizes each slider input
function colorizeSliders(color, hue, brightness, saturation) {
  //Scale hue

  //Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  //Scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //Update input slider colors
  //prettier-ignore
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  //prettier-ignore
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0), rgb(255,255 ,0),rgb(0, 255, 0),rgb(0, 255, 255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))`;
}

//Update hue, brightness and saturation sliders
function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = colors[index].querySelector("h2").innerText;

  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);

  colors[index].style.backgroundColor = color;
}
