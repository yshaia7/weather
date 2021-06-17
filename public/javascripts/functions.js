
//this function gets all of the user locations from the data base and adds them to the displayed list
let userLocations = (async function ()
{
    const response = await fetch('/api/get-user-locations');
    response.json().then(function (data)
    {
        for(let loc of data)
        {
            let location = {name: loc.name, longitude: loc.longitude, latitude: loc.latitude};
            addLocation.createLocation(location);
        }
    })
})


//this function closes the modal and deletes everything in it for reuse
let closeMdl = (function ()
{
    document.getElementById("errors-modal").innerHTML = "";
    closeDialog();
})


//this function manages the creation of the forecast elements
let weather = (function()
{
    //this function clears the forecast for the new selected locations
    (function ()
    {
        let rem = document.getElementById("forecast-list");
        rem.innerHTML = "";
    })()

    locations.cl();
    let som = document.querySelectorAll("li");
    let check = new RegExp('[+-]?([0-9]*[.])?[0-9]+');
    for (let i = 0; i < som.length; i++)
    {
        if(som[i].firstChild.checked == true)
        {
            let name = som[i].getElementsByClassName("col-form-label")[0].innerHTML;
            let long = parseFloat(som[i].getElementsByClassName("form-control-plaintext")[0].value.match(check)[0]);
            let lat = parseFloat(som[i].getElementsByClassName("form-control-plaintext")[1].value.match(check)[0]);
            let loc = new Locations(name,long,lat);
            locations.add(loc);
        }
    }

    if (locations.pr().length > 0)
        document.getElementById('load').hidden = false;

    for(let i = 0; i < locations.pr().length; i++)
        forecast(locations.pr()[i]);

})


//this function handles the request and extraction of data for the forecast
let forecast = (async function (loc)
{
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-light");
    li.innerHTML = "<h4> Location name: " + loc.name;
    let forc7 = document.createElement("ul");
    forc7.classList.add("list-group");

    let str = "http://www.7timer.info/bin/api.pl?lon=" + loc.long + "&lat=" + loc.lat + "&product=civillight&output=json";
    await fetch(str)
        .then(
            function (response)
            {
                //handle the error
                if (response.status !== 200)
                {
                    let md = document.getElementById("errors-modal");
                    let err = document.createElement("h3");
                    err.innerHTML = "Weather forecast service is not available right now, please try again later. Error: " + response.status;
                    md.appendChild(err);
                    openDialog();
                    return;
                }

                // Examine the response and generate the HTML

                response.json().then(function (data) {
                    let convertVal = (function () {
                        let weather = (function (val) {
                            let weatherMap = {
                                'clear': 'Clear',
                                'cloudy': 'Cloudy',
                                'pcloudy': 'Partly cloudy',
                                'vcloudy': 'Very cloudy',
                                'foggy': 'Foggy',
                                'ishower': 'Isolated showers',
                                'oshowers': 'occasional showers',
                                'rain': 'Rain',
                                'lightrain': 'Light rain',
                                'mixed': 'Mixed',
                                'thunderstorm': 'Thunder storm',
                                'windy': 'Windy',
                                'snow': 'Snow'
                            };
                            return weatherMap[val];
                        })
                        let wind = (function (val) {
                            let windMap = {
                                1: '1',
                                2: '0.3-3.4m/s (light)',
                                3: '3.4-8.0m/s (moderate)',
                                4: '8.0-10.8m/s (fresh)',
                                5: '10.8-17.2m/s (strong)',
                                6: '17.2-24.5m/s (gale)',
                                7: '24.5-32.6m/s (storm)',
                                8: 'Over 32.6m/s (hurricane)'
                            };
                            return windMap[val];
                        })
                        return {weather, wind};
                    })()

                    for (let i = 0; i < data.dataseries.length; i++) {
                        let li1 = document.createElement("li");
                        li1.classList.add("list-group-item");
                        li1.classList.add("list-group-item-light");
                        let d = data.dataseries[i].date.toString();
                        let html = "<h4> Weather forecast for " + d.slice(0, 4) + '/' + d.slice(4, 6) + '/' + d.slice(6, 8) + "</h4>";
                        html += "<p> Weather: " + convertVal.weather(data.dataseries[i].weather) + "</p>";
                        html += "<p> Max temp: " + data.dataseries[i].temp2m.max + "<br>Min temp: " + data.dataseries[i].temp2m.min + "</p>";
                        if (data.dataseries[i].wind10m_max !== 1)
                            html += "<p> Wind: " + convertVal.wind(data.dataseries[i].wind10m_max) + "</p>";
                        li1.innerHTML = html;
                        forc7.appendChild(li1);
                    }
                    let img = document.createElement("img");
                    img.classList.add("img-fluid");
                    img.src = "http://www.7timer.info/bin/astro.php? lon=" + loc.long + "&lat=" + loc.lat + "&ac=0&lang=en&unit=metric&output=internal&tzshift=0";
                    li.appendChild(img);
                    li.appendChild(forc7);


                    document.getElementById("forecast-list").appendChild(li);
                    document.getElementById('load').hidden = true;
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :', err);
        })
})


//this function handles the creation and adding of new locations
let addLoc = (async function (e)
{
    let location = {name: document.getElementById('locName').value, longitude: document.getElementById('long').value, latitude: document.getElementById('lat').value};
    let validate = addLocation.validate();
    addLocation.errCheck(validate);

    if(!validate.valid)
        return;

    const response =  fetch('/api/add-Location',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(location)
    })

    addLocation.createLocation(location);

})

//this function removes the location from the list and if its displayed also from the displayed forecast
let removeLoc = (function ()
{
    let location = {name: this.previousSibling.innerHTML};

    const response =  fetch('/api/delete-Location',{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(location)
    })

    let rem = document.getElementById("forecast-list");
    let check = rem.querySelectorAll("h4");
    for(let i = 0; i < check.length; i ++)
    {
        if(check[i].innerHTML.search(this.parentElement.childNodes[0].value) > -1)
        {
            check[i].parentElement.remove();
            break;
        }
    }
    this.parentElement.parentElement.parentElement.remove();

})


//this function removes all of the locations from the list and if its displayed also from the displayed forecast
let removeAllLoc = (function ()
{
    const response =  fetch('/api/delete-All-Locations',{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(location)
    })

    let rem = document.getElementById("locList");
    while (rem.firstChild) {
        rem.removeChild(rem.lastChild);
    }
    rem = document.getElementById("forecast-list");
    while (rem.firstChild) {
        rem.removeChild(rem.lastChild);
    }
})


