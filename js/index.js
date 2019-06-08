// 
// 

// jsonData for switching between °C & °F
var jsonData;   
getGeoLocation();

// adding EventListeners to all buttons
$("#fahrenheit").click(convertCelFar);
$("#celsius").click(convertCelFar);
$(".form-button").click(e => {
  e.preventDefault();getWeather(e.target.form[0].value);
});


// ---------------------------------
//            FUNCTIONS
// ---------------------------------

function getGeoLocation() {     
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => getWeather(`${position.coords.latitude},${position.coords.longitude}`));
  } else {
    alert("GeoLocation not available. Check if you enabled GeoLocation.");
  };
};

// weather by coords, if geolocation is enabled
function getWeather(searchTerm){
  // animate();
  $("#loading").show().animate({ width: "60%" }, 500);

  $.getJSON(`https://api.apixu.com/v1/forecast.json?key=b7c8d803ca1543d2a71222120180204&q=${searchTerm}&days=5`, function(data, status, xhr) {
    jsonData = data;
    appendData(data);
  }).fail($("#loading").animate({ width: "100%" }, 500, () => $("#loading").hide().css("width", "0%")));
};

function appendData(data) {
  // animate();
  $("#loading").animate({ width: "100%" }, 500, () => $("#loading").hide().css("width", "0%"));

  $("#icon").attr("src", "https:" + data.current.condition.icon);
  $("#weatherDesc").empty().append(data.current.condition.text);
  $("#temp").empty().append(data.current.temp_c + "°C");
  $("#city").empty().append(data.location.name + ", " + data.location.country);
  $("#windSpeed").empty().append(`<i class="wi wi-small-craft-advisory"></i>${data.current.wind_kph} km/h`);
  $("#windDeg").empty().append(`<i class="wi wi-wind-direction"></i>${data.current.wind_degree}°`);
  $("#humidity").empty().append(`<i class="wi wi-humidity"></i>${data.current.humidity} %`);
  $("#pressure").empty().append(`<i class="wi wi-barometer"></i>${data.current.pressure_mb} hPa`);
  appendForecast();
};

function appendForecast(format) {
  const forecasts = jsonData.forecast.forecastday;
  format = format || "c";

  $(".forecast-container").empty();
  for(let i=0;i<5;i++) {
    $(".forecast-container").append(`
      <div class="forecast-box">
        <div class="forecast-temp yellow">${forecasts[i].day["maxtemp_" + format]}°${format.toUpperCase()}</div>
        <img style="width: 100%" src="https:${forecasts[i].day.condition.icon}"/>
        <div class="forecast-temp">${forecasts[i].day["mintemp_" + format]}°${format.toUpperCase()}</div>
        <div class="forecast-box-day">${getDay(i)}</div>
      </div>
    `);
  };
}

function getDay(i) {
  const x = new Date(jsonData.current.last_updated_epoch*1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa"];
  const dayStr = days[x.getDay() + 1 + i];
  
  return dayStr;
}

function convertCelFar(){
  const format = $("#celsius").is(":checked") ? "c" : "f";

  $("#temp").empty().append(`${jsonData.current["temp_" + format]}°${format.toUpperCase()}`);
  appendForecast(format);
};

// test; unused / commented out
function animate() {
  $("#icon").hideToggle();
  $("#weatherDesc").hideToggle();
  $("#temp").hideToggle();
  $("#city").hideToggle();
  $("#windSpeed").hideToggle();
  $("#windDeg").hideToggle();
  $("#humidity").hideToggle();
  $("#pressure").hideToggle();
  $(".forecast-container").hideToggle();
}