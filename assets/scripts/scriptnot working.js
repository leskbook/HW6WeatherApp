var searchCity = $("#searchCity");
var searchButton = $("#searchButton");
var clearButton = $("#clearButton");
var currentCity = $("currentCity");
var currentTemperature = $("#currentTemperature");
var currentHumidty = $("#humidity");
var currentWS = $("#windspeed");
var currentUVI = $("#uvi");
var sCity = [];

function find(city) {
    for (var i = 0; i < city.length; i++) {
        if (city.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
}


var APIKey = "5362fb86c8018580e73ae24f04477e57";

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;

    $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
                console.log(response);

                var weathericon = response.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
                var date = new Date(response.dt * 1000).toLocaleDateString();
                $(currentCity).html(response.name + "--" + date + "" + "<img src=" + iconurl + ">");

                var tempF = (response.main.temp - 273.15) * 1.80 + 32;
                $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
                $(currentHumidty).html(response.main.humidty + "%");
                var windsmph = (ws * 2.237).toFixed(1);
                $(currentWS).html(windsmph + "MPH");

                var uvi = weather.current.uvi
                UVIndex(response.coord.lon, response.coord.lat);
                forecast(response.id);
                if (response.cod == 200) {
                    sCity = JSON.parse(localStorage.getItem("cityname"));
                    console.log(sCity);
                    if (sCity == null) {
                        sCity = [];
                        sCity.push(city.toUpperCase());
                        localStorage.setItem("cityname", JSON.stringify(sCity));
                        addToList(city);
                    } else {
                        if (find(city) > 0) {
                            sCity.push(city.toUpperCase());
                            localStorage.setItem("cityname", JSON.stringify(sCity));
                            addToList(city);
                        }

                        function UVIndex(ln, lt) {

                            var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
                            $.ajax({
                                url: uvqURL,
                                method: "GET"
                            }).then(function(response) {
                                $(currentUvindex).html(response.value);
                            });
                        }
                    }

                    if (uvi < 3) {
                        $currentListItem.append("<h6> UV index: " + "<span id='uvig'>" + uvi + "</span>" + "</h6>" + "<br>");
                        uvColor = "green";

                    } else if (uvi > 7) {
                        $currentListItem.append("<h6> UV index: " + "<span id='uvig'>" + uvi + "</span>" + "</h6>" + "<br>");
                        uvColor = "red";

                    } else {
                        $currentListItem.append("<h6> UV index: " + "<span id='uvig'>" + uvi + "</span>" + "</h6>" + "<br>");
                        uvColor = "yellow";
                    };

                }
                $("#search-button").on("click", displayWeather);
                $(document).on("click", invokePastSearch);
                $(window).on("load", loadlastCity);
                $("#clear-history").on("click", clearHistory);