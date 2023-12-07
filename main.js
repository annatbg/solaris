// ~~~~~~~~~ DOM-ELEMENT ~~~~~~~~~~
const planetOverlay = document.getElementById("planetOverlay");
const planetText = document.getElementById("planetText");
const closeButton = document.getElementById("closeButton");
const planetSun = document.getElementById("planet0");
const planetMercurius = document.getElementById("planet1");
const planetVenus = document.getElementById("planet2");
const planetEarth = document.getElementById("planet3");
const planetMars = document.getElementById("planet4");
const planetJupiter = document.getElementById("planet5");
const planetSaturnus = document.getElementById("planet6");
const planetUranus = document.getElementById("planet7");
const planetNeptunus = document.getElementById("planet8");

// ~~~~~~~ EVENTLISTENERS ~~~~~~~~~~
planetSun.addEventListener("click", () => displayPlanetInfo(0));
planetMercurius.addEventListener("click", () => displayPlanetInfo(1));
planetVenus.addEventListener("click", () => displayPlanetInfo(2));
planetEarth.addEventListener("click", () => displayPlanetInfo(3));
planetMars.addEventListener("click", () => displayPlanetInfo(4));
planetJupiter.addEventListener("click", () => displayPlanetInfo(5));
planetSaturnus.addEventListener("click", () => displayPlanetInfo(6));
planetUranus.addEventListener("click", () => displayPlanetInfo(7));
planetNeptunus.addEventListener("click", () => displayPlanetInfo(8));
closeButton.addEventListener("click", () => {
  planetOverlay.style.display = "none";
  console.log("close button clicked");
});
// Ändrar färg på planet0 i planetOverlay
const planet0Overlay = document
  .getElementById("planetOverlay")
  .querySelector("#planet0");

// ~~~~~~~~~ VARIABLER ~~~~~~~~~~~
const keyURL = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys";
const baseURL =
  "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
let planetsData = {};
const planetColors = {
  0: "#ffd029", // Sun
  1: "#888888", // Mercurius
  2: "#e7cdcd", // Venus
  3: "#428ed4", // Earth
  4: "#ef5f5f", // Mars
  5: "#e29468", // Jupiter
  6: "#c7aa72", // Saturnus
  7: "#c9d4f1", // Uranus
  8: "#7a91a7", // Neptunus
};

//   ~~~~~~~ DEKLARERAR FUNKTIONERNA ~~~~~~~~~

// funktion som hämtar api-nyckel från keys-endpointen med en post request
async function getApiKey() {
  let resp = await fetch(keyURL, {
    method: "POST",
  });

  if (!resp.ok) {
    console.error("ooops, something went wrong", resp.status);
    return;
  }
  let data = await resp.json();
  return data.key;
}

// funktion som hämtar all planetdata från endpointen bodies.
async function getPlanets() {
  try {
    const apiKey = await getApiKey();
    console.log("apiKey i getPlanets", apiKey);

    const response = await fetch(baseURL, {
      method: "GET",
      headers: { "x-zocom": apiKey },
    });

    if (!response.ok) {
      throw new Error("ooops, something went wrong", response.status);
    }
    let data = await response.json();
    planetsData = data.bodies;
  } catch (error) {
    console.error(error.message);
  }
  console.log("array", planetsData);
  return planetsData;
}

// funktion som inväntar datan från getPlanets, letar efter ett matchande id, och visar aktuell data för planeten med DOM. (funktionen kallas genom click-events på varje planet)
async function displayPlanetInfo(planetId) {
  // inväntar datan från getPlanets
  const planetsData = await getPlanets();

  // söker efter matchande planet-id med find-metoden?
  const foundPlanet = planetsData.find((planet) => planet.id === planetId);
  // om ingen planet hittas loggas felmeddelande
  if (!foundPlanet) {
    console.log("planet not found");
    return;
  }

  console.log("planet", foundPlanet.name, "clicked!");

  // Hittar en bakgrundsfärg från variabeln planetColors som matchar id't
  const bgColor = planetColors[planetId];

  // Set the background color of #planet0
  const planet0 = document
    .getElementById("planetOverlay")
    .querySelector("#planet0");
  planet0.style.backgroundColor = bgColor;

  // eftersom endpointen "moons" är en array, görs listan till en sträng med metoden join, separerade med parametern ", ". Strängen sparas i variabeln moonString.
  const moonString = foundPlanet.moons.join(", ");
  // style på planetOverlay ändras till flex föratt visa overlay-sidan med planet info
  planetOverlay.style.display = "flex";

  // lägger till data i elementet planetText med template literals
  planetText.innerHTML = `<h1> ${foundPlanet.name} </h1> <h2>${foundPlanet.latinName}</h2> 
  <p> ${foundPlanet.desc} <p>
  <ul>
  <li><h4>Omkrets:</h4>
  <p>${foundPlanet.circumference}</p></li> 
  <li><h4>KM från solen:</h4>
  <p>${foundPlanet.distance}</p></li>
  <li><h4>Max temperatur:</h4> 
  <p>${foundPlanet.temp.day}</p></li> 
  <li><h4>Min temperatur:</h4>
  <p>${foundPlanet.temp.night}</p></li>
  <li><h4>Månar:</h4>
  <p>${moonString}</p></li>
  </ul>`;
}
