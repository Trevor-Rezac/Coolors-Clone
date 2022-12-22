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
  console.log("hexColor", hexColor);
  return hexColor;
}

//Randomize palette
function randomizePalette() {
  colors.forEach((div, index) => {
    const hexText = div.children[0];
    const randomHexColor = generateHexColor();

    div.style.backgroundColor = randomHexColor;
    hexText.innerText = randomHexColor;
  });
}

//Calling the function sets the initial palette
randomizePalette();
