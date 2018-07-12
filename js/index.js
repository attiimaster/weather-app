function getGeoLocation() {     
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getData);
  } else {
    alert("GeoLocation not available. Check if you enabled GeoLocation.");
  };
};

var jsonData ;

function getData(position){
  const searchTerm = position.coords.latitude + "," + position.coords.longitude;

  $.getJSON("https://api.apixu.com/v1/forecast.json?key=b7c8d803ca1543d2a71222120180204&q=" + searchTerm + "&days=5", function(data, status, xhr) {
    jsonData = data;
    appendData(data);
  });
};

function appendData(data) {
  $("#icon").attr("src", "https:" + data.current.condition.icon);
  $("#weatherDesc").empty().append(data.current.condition.text);
  $("#temp").empty().append(data.current.temp_c + "°C");
  $("#city").empty().append(data.location.name + ", " + data.location.country);
  $("#windSpeed").empty().append('<i class="wi wi-small-craft-advisory"></i>' + data.current.wind_kph + " km/h");
  $("#windDeg").empty().append('<i class="wi wi-wind-direction"></i>' + data.current.wind_degree + "°");
  $("#humidity").empty().append('<i class="wi wi-humidity"></i>' + data.current.humidity + " %");
  $("#pressure").empty().append('<i class="wi wi-barometer"></i>' + data.current.pressure_mb + " hPa");
  checkCelOrFahr();
};

function getDay(i) {
  const x = new Date(jsonData.current.last_updated_epoch*1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sa"];
  const dayStr = days[x.getDay() + 1 + i];
  return dayStr;
}

function checkCelOrFahr(){
  const arr = jsonData.forecast.forecastday;
  $(".forecast-container").empty();
  if ($("#celsius").is(":checked")) {
    $("#temp").empty().append(jsonData.current.temp_c + "°C");
    for(let i=0;i<5;i++) {
      $(".forecast-container").append('<div class="forecast-box">' + arr[i].day.maxtemp_c + '°C<img style="width: 100%" src="https:' + arr[i].day.condition.icon + '"/><div class="forecast-temp">' +arr[i].day.mintemp_c + '°C</div><div class="forecast-box-day">' + getDay(i) + '</div></div>');
    };
  } else {
    $("#temp").empty().append(jsonData.current.temp_f + "°F");
    for(let i=0;i<5;i++) {
      $(".forecast-container").append('<div class="forecast-box">' + arr[i].day.maxtemp_f + '°F<img style="width: 100%" src="https:' + arr[i].day.condition.icon + '"/><div class="forecast-temp">' +arr[i].day.mintemp_f + '°F</div><div class="forecast-box-day">' + getDay(i) + '</div></div>');
    };
  }
};


getGeoLocation();

//celToFahr
$("#fahrenheit").on("click", checkCelOrFahr);
$("#celsius").on("click", checkCelOrFahr);


//searchbar fetch
$(".form-button").on("click", function(e) {
  e.preventDefault();
  let searchTerm = e.target.form[0].value;
  $.getJSON("https://api.apixu.com/v1/forecast.json?key=b7c8d803ca1543d2a71222120180204&q=" + searchTerm + "&days=5", function(data, status, xhr) {
    jsonData = data;
    appendData(data);
  });
});
