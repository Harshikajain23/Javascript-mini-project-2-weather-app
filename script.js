console.log("Hello");

const API_KEY = "3ada4ac39eaf8e8f0d431e831edfdbed";

async function showWeather() {
  try {
    let CITY_NAME = "Goa";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    console.log("weather data:-> ", data);

    // let newPara = document.createElement('p');
    // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

    // document.body.appendChild(newPara);

    renderWeatherInfo(data);
  } catch (err) {}

  // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
}

async function getCustomWeatherDetails() {
  try {
    let latitude = 15.6333;
    let longitude = 18.3333;

    let response =
      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric
   `);

    let data = await response.json();

    console.log(data);
  } catch (err) {
    console.log("Error found" ,err);
  }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
       console.log("No geoLocation Support");
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;

    console.log(lat);
    console.log(longi);
}