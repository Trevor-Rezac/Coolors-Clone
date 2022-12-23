//SELECTORS and INITIALIZERS
const generateBtn = document.querySelector(".generate");
const colors = document.querySelectorAll(".color");
const hexColors = document.querySelectorAll(".color h2");

let initialColors;

//EVENT LISTENERS
generateBtn.addEventListener("click", () => {
  randomizePalette();
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
