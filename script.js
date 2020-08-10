

moment().format('L');

//-----------------------Function for Current City Weather----------------------------------//
function searchCity(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&APPID=dd7d0f51057dcc2a1d150ae227e796c3";
    var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&APPID=dd7d0f51057dcc2a1d150ae227e796c3";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
        //Empty divs for displaying content//
        $("#current").empty();
       var mainDate = moment().format('L');
 

        //Creates HTML for city information-city name, date, temp, humidity, windspeed//
        var cityNameEl = $("<h2>").text(response.name);
        var displayMainDate = cityNameEl.append(" " + mainDate);
        var tempEL = $("<p>").text("Temperature: " + response.main.temp);
        var humEl = $("<p>").text("Humidity: " + response.main.humidity);
        var windEl = $("<p>").text("Wind Speed: " + response.wind.speed);
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
        //Creates HTML div to append new elements to render on to the page//
        var newDiv = $('<div>');

        newDiv.append(displayMainDate, currentIcon, tempEL, humEl, windEl);

        $("#current").html(newDiv);
        
//--------------------------------------------- UV data Ajax Call---------------------------------------//

var lat = response.coord.lat;
var lon = response.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&APPID=dd7d0f51057dcc2a1d150ae227e796c3&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('#uvl-display').empty();
            var uvlresults = response.value;
            //Creates HTML for new div for UV data//
            var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
            $('#uvl-display').html(uvlEl);
    
        });
    });


//--------------------------------------------5 Day forecast Ajax Call ---------------------------------------//

    $.ajax({
        url: queryURLforecast,
        method: 'GET'
    }).then(function (response) {
        // Storing an array of results for the results variable//
        var results = response.list;
        //Empty 5 day forecast div//
        $("#5day").empty();
        //Creates HTML for 5 day forecast//
        for (var i = 0; i < results.length; i += 8) {
            // Creates a div for the 5 day forecast//
            var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
            
            //Storing the responses date,temp, and humidity///
            var date = results[i].dt_txt;
            var setD = date.substr(0,10)
            var temp = results[i].main.temp;
            var hum = results[i].main.humidity;
   
            //Creates text for temperature, humidity, and date//
            var h5date = $("<h5 class='card-title'>").text(setD);
            var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
            var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

            var weather = results[i].weather[0].main
            // Associates an icon with corresponding weather conditions//
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

            //Append items to 5 day forecast Div//
            fiveDayDiv.append(h5date);
            fiveDayDiv.append(icon);
            fiveDayDiv.append(pTemp);
            fiveDayDiv.append(pHum);
            $("#5day").append(fiveDayDiv);
        }

    });



}
pageLoad();
//----------------------------------------Event handler for user's city search-----------------------//

$("#select-city").on("click", function (event) {
    // Preventing the button from trying to submit the form//
    event.preventDefault();
    // Storing the city name//
    var cityInput = $("#city-input").val().trim();

    //Saving the search term to local storage//
    var textContent = $(this).siblings("input").val();
    var storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));
  
    searchCity(cityInput);
    pageLoad();
});

//---------------------------Calling stored search item to display once page loads-------------------------------------//
function pageLoad () {
    var lastSearch = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    var psearch = $("<div>");
    psearch.append(searchDiv)
    $("#searchhistory").prepend(psearch);
}

//Event search history//
$("#searchhistory").on('click', '.btn', function(event) {
event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());

});