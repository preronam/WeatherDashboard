
//-----------------------Function to generate Current City Weather (Ajax 1)----------------------------------//
function searchCity(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&APPID=dd7d0f51057dcc2a1d150ae227e796c3";
    var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&APPID=dd7d0f51057dcc2a1d150ae227e796c3";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        // Creates div for displaying current city weather//
        $("#current").empty();
       var mainDate = moment().format('L');
 

        //Creates text for city information-city name, date, temp, humidity, windspeed//
        var cityNameEl = $("<h2>").text(response.name);
        var displayMainDate = cityNameEl.append(" " + mainDate);
        var tempEL = $("<p>").text("Temperature: " + response.main.temp);
        var humidEl = $("<p>").text("Humidity: " + response.main.humidity);
        var windspeedEl = $("<p>").text("Wind Speed: " + response.wind.speed);
        var currentweather = response.weather[0].main;
        
        //Associates an icon with corresponding weather conditions in current city//
        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 50px; width: 50px");
        } else if (currentweather=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 50px; width: 50px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 50px; width: 50px");
        }
         else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 50px; width: 50px");
        }
         else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 50px; width: 50px");
        }
        //Creates div to append current city weather data to render on to the page//
        var weatherDiv = $('<div>');

        weatherDiv.append(displayMainDate, currentIcon, tempEL, humidEl, windspeedEl);

        $("#current").html(weatherDiv);
        
//--------------------------------------------- UV data Ajax Call (Ajax 2)---------------------------------------//

var lat = response.coord.lat;
var lon = response.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&APPID=dd7d0f51057dcc2a1d150ae227e796c3&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('#uv-display').empty();
            var uvresults = response.value;
            //Creates text for new div for UV data//
            var uvEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
            $('#uv-display').html(uvEl);
    
        });
    });


//--------------------------------------------5 Day forecast Ajax Call (Ajax 3)---------------------------------------//

    $.ajax({
        url: queryURLforecast,
        method: 'GET'
    }).then(function (response) {
        // Storing the list of results from the response//
        var results = response.list;
        // Empty 5 day forecast div//
        $("#5day").empty();
        for (var i = 0; i < results.length; i += 8) {
            var fiveDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
            
            //Capturing the responses date,temp, and humidity///
            var date = results[i].dt_txt;
            var setD = date.substr(0,10)
            var temp = results[i].main.temp;
            var hum = results[i].main.humidity;
   
            //Creates text for temperature, humidity, and date//
            var h5date = $("<h5 class='card-title'>").text(setD);
            var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
            var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

            var weather = results[i].weather[0].main
            // Associates an icon with corresponding weather conditions for 5 day Forecast//
            if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } 
             else if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

            //Appending items to 5 day forecast Empty Div//
            fiveDiv.append(h5date);
            fiveDiv.append(icon);
            fiveDiv.append(pTemp);
            fiveDiv.append(pHum);
            $("#5day").append(fiveDiv);
        }

    });



}
pageLoad();
//----------------------------------------Event handler for user's city search input-----------------------//

$("#select-city").on("click", function (event) {
    // Preventing default behavior//
    event.preventDefault();
    // Storing the city name//
    var cityInput = $("#city-input").val().trim();

    //Saving the searched city to local storage//
    var textContent = $(this).siblings("input").val();
    var cityarr = [];
    cityarr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(cityarr));
  
    searchCity(cityInput);
    pageLoad();
});

//---------------------------Calling stored search item to display once page loads-------------------------------------//

//Retrieving last searched city from local storage//
function pageLoad () {
    var lastCity = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastCity);
    var previoussearch = $("<div>");
    previoussearch.append(searchDiv)
    $("#history").prepend(previoussearch);
}

//Event handler for history//
$("#history").on('click', '.btn', function(event) {
event.preventDefault();
    searchCity($(this).text());

});