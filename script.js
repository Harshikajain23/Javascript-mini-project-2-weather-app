const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;

const errorContainer = document.querySelector('.error-container');
const errorImg = document.getElementById('error-img');
const errorMsg = document.getElementById('error-msg');

const API_KEY = "5a9f9ca9ed3143865a5c532da79791e5";
currentTab.classList.add("current-tab");

getfromSessionStorage();

// one thing is pending

// creating switch tab function

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    errorContainer.classList.remove("active");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      // if search form is invisible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // if search form is visible make it invisible
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // now i am in your weather tab
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;

  // make grant container invisible;
  grantAccessContainer.classList.remove("active");

  // make loader visible
  loadingScreen.classList.add("active");

  // Api call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    errorContainer.classList.remove("active");
    const data = await response.json();

    loadingScreen.classList.remove("active");

    userInfoContainer.classList.add("active");


    // render
    renderWeatherInfo(data);

     if (data.cod != 200) {
      userInfoContainer.classList.remove("active");
      errorContainer.classList.add("active");
      errorImg.src = "assets/not-found.png"; // make sure this path is correct
      errorMsg.textContent = data.message || "City not found!";
      return; // stop execution
    }
  } catch (err) {
    // hw

    // i tried but not working
    loadingScreen.classList.remove("active");

    // Optionally hide user info if previously visible
    userInfoContainer.classList.remove("active");

    // Show an error message to the user
    alert(
      "Failed to fetch weather data. Please check your internet connection or try again later."
    );

    errorContainer.classList.add("active");
    // make sure path is correct
    errorMsg.textContent =
      err.message === "City not found"
        ? "City not found! Please check the city name."
        : "Something went wrong. Please try again.";
  }
}

function renderWeatherInfo(weatherInfo) {
  // first , we have to fetch the element

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");

  const description = document.querySelector("[data-weatherDesc]");

  const weatherIcon = document.querySelector("[data-weatherIcon]");

  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");

  const humidity = document.querySelector("[data-humidity]");

  const cloudiness = document.querySelector("[data-cloudiness]");

  // fetch values from weather Info and put it into elements

  // weather info ke under city ka naam nikalo
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  description.innerText = weatherInfo?.weather?.[0]?.description;

  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText =`${weatherInfo?.main?.temp} °C`;

  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

  humidity.innerText = `${weatherInfo?.main?.humidity}%`;

  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // show an alert for no geolocation support available
    alert("Geolocation is not supported by your browser.");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

  fetchUserWeatherInfo(userCoordinates);
}
// grant access pe listener lagana hai

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  // remove default behavior
  e.preventDefault();

  let cityName = searchInput.value;
 if (!cityName) {
  userInfoContainer.classList.remove("active");
  errorContainer.classList.add("active");
  errorImg.src = "assets/not-found.png";
  errorMsg.textContent = "Please enter a valid city name!";
  return;
}

  fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  errorContainer.classList.remove("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

   
 loadingScreen.classList.remove("active");

 if (data.cod != 200) {
  userInfoContainer.classList.remove("active");
  errorContainer.classList.add("active");
  errorImg.src = "assets/not-found.png";
  errorMsg.textContent = "City not found !";
  return;
}

userInfoContainer.classList.add("active");
renderWeatherInfo(data);
  } catch (err) {

    // hide loader & info section
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");

    errorContainer.classList.add("active");
    
    errorMsg.textContent =
      err.message === "City not found"
        ? "City not found! Please check the city name."
        : "Something went wrong. Please try again.";
  }
}

