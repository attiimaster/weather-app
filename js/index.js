// 
// 

"use strict";

// jsonData for switching between °C & °F
var jsonData;   
init();

// ---------------------------------
//            FUNCTIONS
// ---------------------------------

function init() {
  const previousQuery = localStorage.getItem("previousQuery");
  
  if (previousQuery) {
    getWeather(JSON.parse(previousQuery));
  } else {
    // getGeoLocation();
  }

  // adding EventListeners to all buttons
  document.getElementById("fahrenheit").addEventListener("click", changeTemperatureUnit);
  document.getElementById("celsius").addEventListener("click", changeTemperatureUnit);
  document.querySelector(".form-button").addEventListener("click", e => {
    e.preventDefault();
    getWeather(e.target.form[0].value);
  });
  document.querySelector(".geo-button").addEventListener("click", getGeoLocation);
}

function getGeoLocation() {     
  if("geolocation" in navigator) {
    document.getElementById("loading").className = "loading25";
    navigator.geolocation.getCurrentPosition(position => getWeather(`${position.coords.latitude},${position.coords.longitude}`));
  } else {
    alert("GeoLocation not available. Check if you enabled GeoLocation.");
  };
};

// weather by coords (if geolocation is enabled) or city name
function getWeather(query){
  document.getElementById("loading").className = "loading50";

  fadeOutElements();

  fetch(`https://api.apixu.com/v1/forecast.json?key=b7c8d803ca1543d2a71222120180204&q=${query}&days=5`)
  .then(res => res.json())
  .then(data => {
    jsonData = data;
    localStorage && localStorage.setItem("previousQuery", JSON.stringify(query))
    appendData(data);
  })
  .catch(err => {
    document.getElementById("loading").className = "loading100";
    setTimeout(() => document.getElementById("loading").className = "loading0", 500);
  });
};


// DOM manipulation

function appendData(data) {
  document.getElementById("loading").className = "loading75";
  document.getElementById("icon").setAttribute("src", `https:${data.current.condition.icon}`);
  document.getElementById("weatherDesc").innerHTML = data.current.condition.text;
  document.getElementById("temp").innerHTML = data.current.temp_c + "°C";
  document.getElementById("city").innerHTML = data.location.name + ", " + data.location.country;
  document.getElementById("windSpeed").innerHTML = `<i class="wi wi-small-craft-advisory"></i>${data.current.wind_kph} km/h`;
  document.getElementById("windDeg").innerHTML = `<i class="wi wi-wind-direction"></i>${data.current.wind_degree}°`;
  document.getElementById("humidity").innerHTML = `<i class="wi wi-humidity"></i>${data.current.humidity} %`;
  document.getElementById("pressure").innerHTML = `<i class="wi wi-barometer"></i>${data.current.pressure_mb} hPa`;
  fadeInElements();

  appendForecast(data);

  document.getElementById("loading").className = "loading100";
  setTimeout(() => document.getElementById("loading").className = "loading0", 500);
};

function appendForecast(data, format) {
  const forecasts = data.forecast.forecastday;
  format = format || "c";

  document.querySelector(".forecast-container").innerHTML = "";
  const string = forecasts.map((el, i) => {
    return `
      <div class="forecast-box">
        <div class="forecast-temp yellow">${forecasts[i].day["maxtemp_" + format]}°${format.toUpperCase()}</div>
        <img style="width: 100%" src="https:${forecasts[i].day.condition.icon}"/>
        <div class="forecast-temp">${forecasts[i].day["mintemp_" + format]}°${format.toUpperCase()}</div>
        <div class="forecast-box-day">${getDay(i)}</div>
      </div>
    `
  });
  document.querySelector(".forecast-container").innerHTML = string.join("");
  fadeInForecasts();
}

function changeTemperatureUnit(){
  // onClickEvent for Fahrenheit && Celsius buttons
  const format = document.getElementById("celsius").checked ? "c" : "f";
  const tempElement = document.getElementById("temp");

  tempElement.classList.remove("animate");  // hacky animate
  tempElement.innerHTML = `${jsonData.current["temp_" + format]}°${format.toUpperCase()}`;
  setTimeout(() => tempElement.classList.add("animate"), 100);

  appendForecast(jsonData, format);
};


// misc functions

function getDay(i) {
  const x = new Date(jsonData.current.last_updated_epoch*1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa"];
  const dayStr = days[x.getDay() + 1 + i];
  
  return dayStr;
}


// animation functions;

function fadeInElements() {
  // fade in elements with css (eg. #div.show { opacity: 1 })
  const elements = document.querySelectorAll(".toAnimate");
  elements.forEach((el, i) => el.classList.add("animate"));
}

function fadeInForecasts() {
  // forecast animation works a bit differently, injects html (bad!) and no .toAnimate (CSS)
  const forecastBoxes = document.querySelectorAll(".forecast-box");
  forecastBoxes.forEach((el, i) => setTimeout(() => el.classList.add("animate"), 100 * (i+1))); 
}

function fadeOutElements() {
  // actually removes elements instantly without any animation
  const elements = document.querySelectorAll(".toAnimate");
  elements.forEach((el, i) => el.classList.remove("animate"));

  const forecastBoxes = document.querySelectorAll(".forecast-box");
  forecastBoxes.forEach(el => el.classList.remove("animate")); 
}