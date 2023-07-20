function getElement(selector) {
  return document.querySelector(selector);
}

const bodyElement = getElement('[data-js="body"]');
const formElement = getElement('[data-js="form"]');
const colorInputElement = getElement('[data-js="colorInput"]');
const moodElement = getElement('[data-js="mood"]');
const meaningElement = document.querySelector('[data-js="meaning"]');
const footerElement = getElement('[data-js="footer"]');

function handleColorChange(colorName) {
  bodyElement.style.backgroundColor = colorName;
}

async function handleColorSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const colorObject = Object.fromEntries(formData);
  const { color, colorMeaning } = colorObject;

  const moodText = `
  COLOUR MEANING: ${colorMeaning}.
  Heute fühle ich mich "${color}!". 
  `;
  moodElement.textContent = moodText;

  const response = await fetch("http://localhost:3000/color", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      colorObject,
    }),
  });

  if (response.ok) {
    console.log(`"${color}" color has been saved successfully`);
  }
  if (
    (error) => {
      console.error(`"Error saving "${color}" color:`, error);
    }
  );
}

async function handleOnPageLoad() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  footerElement.textContent = `Bill ${year}`;

  const COLOR_URL = "http://localhost:3000/color";
  const response = await fetch(COLOR_URL);
  if (!response.ok) {
    alert(`Error reading color from the server`);
    return;
  }
  const colorData = await response.json();
  const { color, colorMeaning } = colorData;

  if (!response.ok) {
    alert(`"Error reading "${color}" color from the server"`);
    return;
  }

  bodyElement.style.backgroundColor = color;
  moodElement.textContent = `My color is ${color}`;
  meaningElement.textContent = `The colour ${color} is associated with ${colorMeaning}`;
}

formElement.addEventListener("submit", handleColorSubmit);
colorInputElement.addEventListener("input", () => {
  const colorName = colorInputElement.value;
  handleColorChange(colorName);
});
window.addEventListener("load", handleOnPageLoad);
