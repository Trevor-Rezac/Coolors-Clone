//SELECTORS and INITIALIZERS
const generateBtn = document.querySelector(".generate");
const colors = document.querySelectorAll(".color");
const hexColors = document.querySelectorAll(".color h2");
const sliders = document.querySelectorAll("input[type='range']");
const adjustBtns = document.querySelectorAll(".adjust");
const lockBtns = document.querySelectorAll(".lock");
const closeAdjustBtns = document.querySelectorAll(".close-adjustment");
const slidersDivs = document.querySelectorAll(".sliders");
const copyContainer = document.querySelector(".copy-container");

let initialColors;

//EVENT LISTENERS
generateBtn.addEventListener("click", () => {
  randomizePalette();
});

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colors.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateHexText(index);
  });
});

adjustBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    toggleAdjustmentPanel(index);
  });
});

closeAdjustBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    toggleAdjustmentPanel(index);
  });
});

lockBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    toggleLock(index);
  });
});

hexColors.forEach((color) => {
  color.addEventListener("click", () => {
    copyToClipboard(color);
  });
});

//FUNCTIONS

//Hex color generator
function generateHexColor() {
  const hexColor = chroma.random();
  return hexColor;
}

//Randomize palette
function randomizePalette() {
  initialColors = [];

  colors.forEach((div, index) => {
    const hexText = div.children[0];
    const randomHexColor = generateHexColor();
    const icons = div.children[1].getElementsByTagName("button");

    //add the color to the initial color array
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomHexColor).hex());
    }

    div.style.backgroundColor = randomHexColor;
    hexText.innerText = randomHexColor;

    checkContrast(randomHexColor, hexText);

    for (icon of icons) {
      if (hexText.style.color === "white") {
        icon.style.color = "white";
      }
      if (hexText.style.color === "black") {
        icon.style.color = "black";
      }
    }

    //Set color sliders
    const color = chroma(randomHexColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(randomHexColor, hue, brightness, saturation);
  });

  //reset inputs
  resetInputs();
}

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

  //set bgColor to initial color so as not to lose original color when slider updates hex value
  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);

  colors[index].style.backgroundColor = color;

  //Re-Colorize the sliders
  colorizeSliders(color, hue, brightness, saturation);
}

function updateHexText(index) {
  const activeColor = colors[index];
  const color = chroma(activeColor.style.backgroundColor);
  const hexText = activeColor.querySelector("h2");
  const icons = activeColor.querySelectorAll(".controls button");

  hexText.innerText = color.hex();
  checkContrast(color, hexText);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

//resets the slider input to the corresponding value
function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightnessColor =
        initialColors[slider.getAttribute("data-brightness")];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = Math.floor(brightnessValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const saturationColor =
        initialColors[slider.getAttribute("data-saturation")];
      const saturationValue = chroma(saturationColor).hsl()[1];
      slider.value = Math.floor(saturationValue * 100) / 100;
    }
  });
}

function toggleAdjustmentPanel(index) {
  slidersDivs[index].classList.toggle("active");
}

function toggleLock(index) {
  colors[index].classList.toggle("locked");
  lockBtns[index].firstChild.classList.toggle("fa-lock-open");
  lockBtns[index].firstChild.classList.toggle("fa-lock");
}

function copyToClipboard(hexColor) {
  //copies the current hexColor h2 text
  navigator.clipboard.writeText(hexColor.innerText);

  //Show copy popup modal
  const popupBox = copyContainer.children[0];
  const popupHeader = popupBox.children[0];
  const copiedHexColor = popupBox.children[1];
  copiedHexColor.innerText = `${hexColor.innerText}`;
  checkContrast(hexColor.innerText, popupHeader);
  checkContrast(hexColor.innerText, copiedHexColor);

  copyContainer.classList.toggle("active");
  popupBox.classList.add("active");
  popupBox.style.backgroundColor = `${hexColor.innerText}`;
  setTimeout(hidePopup, 1500);
}

//Reset copy popup modal
function hidePopup() {
  const popupBox = copyContainer.children[0];
  copyContainer.classList.remove("active");
  popupBox.classList.remove("active");
}

//THE BELOW SECTION IS FOR IMPLEMENTING THE SAVE PALETTE FEATURE
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSaveBtn = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-popup input");
const libraryContainer = document.querySelector(".library-container");
const closeLibraryBtn = document.querySelector(".close-library");
const libraryBtn = document.querySelector(".library");

let savedPalettes = [];

saveBtn.addEventListener("click", openSavePalette);
closeSaveBtn.addEventListener("click", closeSavePalette);
submitSave.addEventListener("click", savePalette);

libraryBtn.addEventListener("click", openLibraryPalette);
closeLibraryBtn.addEventListener("click", closeLibraryPalette);

function openSavePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
  //Set popup background to linear gradient of palette colors
  popup.style.backgroundImage = `linear-gradient(to right, ${hexColors[0].innerText} 10%, ${hexColors[1].innerText} 30%, ${hexColors[2].innerText} 50%, ${hexColors[3].innerText} 70%, ${hexColors[4].innerText} 90%)`;
}

function closeSavePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette(e) {
  const paletteName = saveInput.value;
  const colors = [];
  hexColors.forEach((hexColor) => {
    colors.push(hexColor.innerText);
  });

  //Generate the palette object to be saved
  //push to saved palettes array
  let paletteNum = savedPalettes.length;
  const paletteObj = { paletteName, colors, nr: paletteNum };
  savedPalettes.push(paletteObj);
  //Save to local storage
  saveToLocalStorage(paletteObj);
  saveInput.value = "";
  closeSavePalette(e);

  const savedPalette = renderSavedPalette(paletteObj);
  console.log("savedPalette", savedPalette);
}

function saveToLocalStorage(obj) {
  let localPalettes;

  //check if LS storage already has palettes, if not
  //create an empty array
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    //if there are palettes, we parse the LS JSON data
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }

  //after checking, we are pushing and saving the current palette
  localPalettes.push(obj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));

  //append the saved palette to the library
  const savedPalette = renderSavedPalette(obj);
  console.log("check", libraryContainer.children);
  const savedPalettesDiv = document.querySelector(".saved-palettes");
  savedPalettesDiv.appendChild(savedPalette);
}

function openLibraryPalette(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

function closeLibraryPalette(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

//this renders a 'preview' of a saved palette
//this div displays in the library popup
function renderSavedPalette(obj) {
  const paletteContainer = document.createElement("div");
  paletteContainer.classList.add("saved-palette");

  const title = document.createElement("h4");
  title.innerText = obj.paletteName;

  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  obj.colors.forEach((color) => {
    console.log("color", color);
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = color;
    preview.appendChild(smallDiv);
  });

  const selectBtn = document.createElement("button");
  selectBtn.classList.add("select-palette-btn");
  selectBtn.innerText = "Select";

  paletteContainer.appendChild(title);
  paletteContainer.appendChild(preview);
  paletteContainer.appendChild(selectBtn);

  return paletteContainer;
}

//Calling the function sets the initial palette
randomizePalette();
