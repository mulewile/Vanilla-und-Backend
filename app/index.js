function getElement(selector) {
  return document.querySelector(selector);
}

const bodyElement = getElement('[data-js="body"]');
const formElement = getElement('[data-js="form"]');
const colorInputElement = getElement('[data-js="colorInput"]');
const moodElement = getElement('[data-js="mood"]');
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
  Also ich bin "${color}". 
  Mal sehen, was ich morgen sein werde!`;
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

  const response = await fetch("http://localhost:3000/color");
  const data = await response.json();
  if (!response.ok) {
    alert(`"Error reading "${data.color}" color from the server"`);
    return;
  }

  bodyElement.style.backgroundColor = data.color;
  console.log(data);
}

formElement.addEventListener("submit", handleColorSubmit);
colorInputElement.addEventListener("input", () => {
  const colorName = colorInputElement.value;
  handleColorChange(colorName);
});
window.addEventListener("load", handleOnPageLoad);
