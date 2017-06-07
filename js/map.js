    /*--------------------------*/
    /* set up global variables. */
    /*--------------------------*/
google.charts.load('current', {'packages':['corechart']}); //velda chart

var xmlhttp = new XMLHttpRequest();
var AppIdKey = '5285c55183ef5de1fc376eb445326ff5';
var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
var units = "";
var noDays = "";
var city = "";
var lon= "53";
var lat = "-6";
var unitNotes = {rain:"", wind:"",degrees:""};
var weekly = true;
var specificDay = 0;
var dayTitle = "";
var dataToChart = [];
dataToChart.push(['Time', 'Temp', 'Rain']);


    /*---------------------------*/
    /* when go button is clicked */
    /*---------------------------*/
function clickButton(){
    console.log("clickButton")
    /*--------------------------*/
    /* set up global variables. */
    /*--------------------------*/
    var requiredField = document.getElementById("location").value;
    units = document.querySelector('input[name="units"]:checked').value;
    noDays = document.querySelector('input[name="days"]:checked').value;
    city = document.getElementById("location").value;
    city = city.trim();
    if (units == "metric"){
        unitNotes.rain = "mm";
        unitNotes.degrees = '&#8451;';
        unitNotes.wind = "m/s";
    }
    else{
        unitNotes.rain = "in";
        unitNotes.degrees = '&#8457;';
        unitNotes.wind = "m/h";
    }
//    empty the chart variable
    while(dataToChart.length > 0) {
        dataToChart.pop();
    }
    dataToChart.push(['Time', 'Temp', 'Rain']);
    /*------------------------------------------*/
    /* check that the location field is entered */
    /* continue if it is else print out error   */
    /*------------------------------------------*/
    if (requiredField == "" )
    {
        /*alert("Please fill in a value for this required field.");*/
        document.getElementById("errorMessage").innerHTML= "Please fill in the location";
        requiredfield.focus();
        event.preventDefault();
    }
    else{
        document.getElementById("temp_chart").innerHTML= "";
        document.getElementById("temp_chart").style.display = "none";
        getMap();       // set up the map
    }
} /*end clickButton function*/

function getMap() {
//    console.log("getMap")
    document.getElementById("mapHeader").innerHTML = "MAP"
    var mapProp = {
        center:new google.maps.LatLng(51.508742,-0.120850),
        zoom:10,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map=new google.maps.Map(document.getElementById("Map"),mapProp);
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map);
} /*end get map function*/

/* got code from https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple*/
function geocodeAddress(geocoder, resultsMap) {
//    console.log("geocodeAddress ")
    var address = document.getElementById("location").value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) 
        {
            resultsMap.setCenter(results[0].geometry.location);
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            getJson();      // get the daily forecast
        } 
        else 
        {
          alert('Geocode was not successful for the following reason: ' + status);
          document.getElementById("errorMessage").innerHTML = "Could not find location. Please try again.";  
        }
        lat = results[0].geometry.location.lat();
        lon = results[0].geometry.location.lng();
    });
} /* end geocodeAddress function */

xmlhttp.onreadystatechange = function() {
//    console.log("velda onreadystatechange")
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (weekly){
            fetchData(xmlhttp.responseText);
        }
        else{
            fetchDetailed(xmlhttp.responseText);
        }
    }
};

/*get the json feed. Help gotten from https://www.youtube.com/watch?v=zPplu-JfKO0 for this code as well as the code given in class*/
function getJson(){
    weekly = true;
    var reqUrl = openWeatherUrl + "/daily?lat=" + lat + "&lon=" + lon + "&mode=json" + "&appid=" + AppIdKey + "&units=" + units + "&cnt=" + noDays;
    xmlhttp.open("GET", reqUrl, true);
    xmlhttp.send();
}


function fetchData (forecast) {
//    console.log("fetchData")
//    console.log(forecast)
    var html = '';
    var allForecast = JSON.parse(forecast);
    for (i = 0; i < noDays; i++) {
        html += makeHtml(allForecast.list[i])
    }
    
    document.getElementById("mainHeader").innerHTML = "FORECAST";
    document.getElementById("dailyForecast").innerHTML = html;
}

/*--------------------------------------------------------------------------*/
/*                      got help for check boxes from                       */
/* http://www.java2s.com/Tutorial/JavaScript/0200__Form/Checkboxchecked.htm */
/*--------------------------------------------------------------------------*/
function makeHtml (dayforecast) {
//    console.log("makeHtml")
    
    /*-------------------*/
    /* set up variables. */
    /*-------------------*/
    var width = (100/noDays) - 2;
    var day = new Date(dayforecast.dt *1000);
    var dayofweek = Number(day.getDay());
    
    /*---------------------*/
    /* set up html output. */
    /*---------------------*/
    var html = '<article style="width:' + width + '%";'+ '>';
    switch (dayofweek){
        case 0:
            html += '<h3>Sun</h3>';
            break;
        case 1:
            html += '<h3>Mon</h3>';
            break;
        case 2:
            html += '<h3>Tues</h3>';
            break;
        case 3:
            html += '<h3>Wed</h3>';
            break;
        case 4:
            html += '<h3>Thurs</h3>';
            break;
        case 5:
            html += '<h3>Fri</h3>';
            break;
        case 6:
            html += '<h3>Sat</h3>';
            break;
    }
//    html += '<img src="http://openweathermap.org/img/w/' + dayforecast.weather[0].icon + '.png">';
    html += '<img src="img/' + dayforecast.weather[0].icon + '.png">'; //Velda
    html += '<p>' + dayforecast.weather[0].description + '</p><br>';
    html += '<p id="temp"><span style="font-size:50%">Hi </span>';
    html += Math.round(dayforecast.temp.max) + unitNotes.degrees + '</p>';
    html += '<p id="temp"><span style="font-size:50%">Lo </span>';
    html += Math.round(dayforecast.temp.min) + unitNotes.degrees + '</p>';
    // only dispaly rain if checked
    if(document.optionsForm.rain.checked == true){
        html += '<p>Rainfall:<p><p id="temp">';
        if (typeof dayforecast.rain === "undefined" || isNaN(dayforecast.rain) === true){
            html += 0 + unitNotes.rain + ' </p>';
        }
        else{
            html += Math.round(dayforecast.rain) + unitNotes.rain + ' </p>';
        }  
    }
    // only dispaly pressure if checked
    if(document.optionsForm.pressure.checked == true){
        html += '<p>Pressure: ' + Math.round(dayforecast.pressure) + ' hPa</p>';
    }
    // only dispaly Humidity if checked
    if(document.optionsForm.humidity.checked == true){
        html += '<p>Humidity: ' + dayforecast.humidity + '%</p>';
    }
     // only dispaly Wind if checked
    if(document.optionsForm.wind.checked == true){
        html += '<p>Wind Speed: '+ dayforecast.speed + unitNotes.wind + '</p>';
    }
    html += '<br><input type="button" value="more"  class="submitBtn" onclick="detailedForecast(' + dayforecast.dt +')"></article>';
    return html;
}

function detailedForecast(dateTime){
//    console.log("detailedForecast")
    weekly = false;
    var lookingDay = new Date(dateTime *1000);
    specificDay = Number(lookingDay.getDay());
    
    var reqUrl = openWeatherUrl + "?lat=" + lat + "&lon=" + lon + "&mode=json" + "&appid=" + AppIdKey + "&units=" + units;
    xmlhttp.open("GET", reqUrl, true);
    xmlhttp.send();
}

function fetchDetailed (forecast) {
//    console.log("fetchDetailed")
    var html = '';
    var detailedForecast = JSON.parse(forecast);
    console.log("last part" + detailedForecast)
    html += headerHtml();
    for (i = 0; i < detailedForecast.list.length; i++) {
        // only show data for the specific day.
        var day = new Date(detailedForecast.list[i].dt *1000);
        var dayofweek = Number(day.getDay());
//        console.log("specificDay: " + specificDay + " dayofweek " + dayofweek + " check " + (dayofweek == specificDay))
        if (dayofweek == specificDay){
            html += makedetailedHtml(detailedForecast.list[i])
        }
    }
    document.getElementById("mainHeader").innerHTML = dayTitle;
    drawChart();    //velda trying chart
    document.getElementById("dailyForecast").innerHTML = html;
//    console.log("html: " +html);
    
}

function headerHtml(){
    console.log("headerHtml")
    var html = '';
    switch (specificDay){
        case 0:
            dayTitle = 'Sunday';
            break;
        case 1:
            dayTitle = 'Monday';
            break;
        case 2:
            dayTitle = 'Tuesday';
            break;
        case 3:
            dayTitle = 'Wednesday';
            break;
        case 4:
            dayTitle = 'Thursday';
            break;
        case 5:
            dayTitle = 'Friday';
            break;
        case 6:
            dayTitle = 'Saturday';
            break;
    }
    html += '<article style="width:12%";>';
    html += '<p style="margin-bottom: 55px;">Time:</p>';
    html += '<p style="height: 3em;">Desc:</p>';
    html += '<p>Temp:</p>';
    html += '<p>Rain:</p>';
    html += '<p>Pressure:</p>';
    html += '<p>Humidity:</p>';
    html += '<p>Wind:</p>';
    html += '</article>';
    return html;
}
    
function makedetailedHtml (detailedforecast) {
    console.log("detailedforecast")
    /*-------------------*/
    /* set up variables. */
    /*-------------------*/
    console.log(detailedforecast);
    var time = new Date(detailedforecast.dt *1000);
    
    console.log("time" + time);
    console.log("time.getHours()" + time.getHours());
    
    var rainfall = 0;
    /*---------------------*/
    /* set up html output. */
    /*---------------------*/
    var html = '<article style="width:9%";>';
    switch (time.getHours()){
            /* had to put in each case as it doesn't always return the same time*/
        case 0:
            html += '<p>Midnight</p>';
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
            html += '<p>'+time.getHours()+'am</p>';
            break;
        case 12:
            html += '<p>Noon</p>';
            break;
        case 13:
            html += '<p>1pm</p>';
            break;
        case 14:
            html += '<p>2pm</p>';
            break;
        case 15:
            html += '<p>3pm</p>';
            break;
        case 16:
            html += '<p>4pm</p>';
            break;
        case 17:
            html += '<p>5pm</p>';
            break;
        case 18:
            html += '<p>6pm</p>';
            break;
        case 19:
            html += '<p>7pm</p>';
            break;
        case 20:
            html += '<p>8pm</p>';
            break;
        case 21:
            html += '<p>9pm</p>';
            break;
        case 22:
            html += '<p>10pm</p>';
            break;
        case 23:
            html += '<p>11pm</p>';
            break;
        case 14:
            html += '<p>Midnight</p>';
            break;
    }        
//    html += '<img src="http://openweathermap.org/img/w/' + detailedforecast.weather[0].icon + '.png">';
    html += '<img src="img/' + detailedforecast.weather[0].icon + '.png">'; // velda
    html += '<p style="height: 3em;">' + detailedforecast.weather[0].description + '</p>';
    html += '<p>' + Math.round(detailedforecast.main.temp) + unitNotes.degrees + '</p>';
    if (typeof detailedforecast.rain === "undefined" || detailedforecast.rain["3h"] === "" || detailedforecast.rain["3h"] === null || detailedforecast.rain["3h"] === "null" || isNaN(detailedforecast.rain["3h"]) === true){
        rainfall = 0;
        dataToChart.push([time.getHours(),Number(detailedforecast.main.temp),0]); //set data for the chart
    }
    else{
        rainfall = detailedforecast.rain["3h"]
        dataToChart.push([time.getHours(),Number(detailedforecast.main.temp),Number(detailedforecast.rain["3h"])]); //set data for the chart
    } 
    html += Math.round(rainfall *100)/100 + unitNotes.rain + ' </p>';
    html += '<p>' + Math.round(detailedforecast.main.pressure) + ' hPa</p>';
    html += '<p>' + detailedforecast.main.humidity + '%</p>'
    html += '<p>' + detailedforecast.wind.speed + unitNotes.wind + '</p>';
    html += '</article>';
    return html;
}

// code from https://developers.google.com/chart/interactive/docs/gallery/linechart#curving-the-lines
// then changed code to do what I wanted.
function drawChart(){
//    console.log("dataToChart")
    document.getElementById("temp_chart").style.display = "inline";
    var data = new google.visualization.arrayToDataTable(dataToChart);
    
    var options = {
        title: 'Temperature and rainfall',
        curveType: 'function',
        legend:{position: 'right'},
        hAxis: {gridlines: {count: 7}},series: {
            0:{color: 'red', lineWidth: 3, pointSize: 5},
            1:{color: 'cornflowerblue', lineWidth: 3, pointSize: 5},
        },
        titleTextStyle:{color: 'cornflowerblue',fontSize: 20}
    };
    var chart = new google.visualization.AreaChart(document.getElementById('temp_chart'));
    
    chart.draw(data, options);
    
}
