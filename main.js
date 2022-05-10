window.addEventListener("DOMContentLoaded", function() {
    let lastSearch;
    let box = document.querySelector(".box");

    box.style.opacity = 1;

    let btn = document.querySelector(".box .search .button");
    let srch = document.querySelector(".box .search .field");

    let curWeat = document.querySelector(".weather .current");
    let curSelAll = document.querySelectorAll(".weather .current");

    let FiveHeader = document.querySelector(".fiveDays .header");
    let FiveBox = document.querySelector(".weather .fiveDays");
    let FiveTime = document.querySelectorAll(".days .smth .time");
    let FiveWeather = document.querySelectorAll(".days .smth .curWeat");
    let FiveTemp = document.querySelectorAll(".days .smth .temp");

    let reolad = document.querySelector(".weather .reolad");
    let reoladTime = document.querySelector(".reolad .update");
    let reoladBtn = document.querySelector(".reolad .button");

    srch.addEventListener("focus", () => {
        btn.disabled = true;
        srch.placeholder = "";
    })

    srch.addEventListener("blur", (event) => {
        srch.placeholder = "Enter your city";
        if (event.target.value != 0) {
            btn.disabled = false;
        } 
    })

    function uploadData(value) {

        let nameCheck = curSelAll[0].children[0].innerHTML;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=1a90dd28864a30be83b7e84f160d194b`)
        .then(response => response.json())
        .then(data => {

            if (nameCheck != "" && data.name) {
                curWeat.style.opacity = 0;
                setTimeout(() => {
                    innerData(data);
                    reoladTime.innerHTML = `Last update time: ${timeConverter(data.dt, 1)}`;
                }, 1000);
            } else if (data.name) {
                innerData(data);
                reoladTime.innerHTML = `Last update time: ${timeConverter(data.dt, 1)}`;
            } else {
                alert("No such city found :(");
            }
        
        }).catch(err => {
            alert("Oops! You lost your internet connection");
            console.log(err);
        });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=1a90dd28864a30be83b7e84f160d194b`)
        .then(response => response.json())
        .then(data => {
            if (nameCheck != "" && data.city.name) {
                FiveBox.style.opacity = 0;
                reolad.style.opacity = 0;
                setTimeout(() => {
                    fiveDays(data);
                }, 1000);
            } else if (data.city.name) {
                fiveDays(data);
            }
        }).catch(err => {
            console.log(err);
        })
    }
    
    btn.addEventListener("click", () => {
        lastSearch = srch.value;
        uploadData(lastSearch);
    })

    reoladBtn.addEventListener("click", () => {
        uploadData(lastSearch);
    });

    function innerData (data) {
        curSelAll[0].children[0].innerHTML = data.name;
        curSelAll[0].children[1].innerHTML = data.weather[0].main;
        curSelAll[0].children[2].innerHTML = Math.floor((data.main.temp - 273)) + "℃";
        curSelAll[0].children[3].innerHTML = timeConverter(data.dt);
        curSelAll[0].children[4].innerHTML = windDirection(data.wind.deg) + " " + Math.floor((data.wind.speed) * 10) / 10 + " m/s";
        curWeat.style.opacity = 1;
    }

    function fiveDays(data) {
        FiveHeader.innerHTML = `Weather in ${data.city.name} for 5 days`;
        FiveBox.style.opacity = 1;
        for (let i = 1; i < 6; i++) {
            FiveTime[i - 1].innerHTML = timeConverter(data.list[(i * 8) - 1].dt, 5);
            FiveWeather[i - 1].innerHTML = data.list[(i * 8) - 1].weather[0].main;
            FiveTemp[i - 1].innerHTML = Math.floor((data.list[(i * 8) - 1].main.temp - 273)) + "℃";
        }
        reolad.style.opacity = 1;
    }
})

function windDirection(degrees) {
    let res;
    if (degrees === 0) {
        res = "E";
    } else if (degrees === 90) {
        res = "N";
    } else if (degrees === 180) {
        res = "W";
    } else if (degrees === 270) {
        res = "S";
    } else if (degrees >= 0 && degrees <= 90) {
        res = "NE";
    } else if (degrees >= 90 && degrees <= 180) {
        res = "NW";
    } else if (degrees >= 180 && degrees <= 270) {
        res = "SW";
    } else {
        res = "SE";
    }
    return res;
}

function timeConverter(time, arg){
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let currentTime = new Date(time * 1000);
    let year = currentTime.getFullYear();
    let month = months[currentTime.getMonth()];
    let date = currentTime.getDate();
    let hours = currentTime.getHours();
    let min = currentTime.getMinutes();
    if (arg === 5) {
        return date + ' ' + month;
    } else if (arg === 1) {
        if (min >= 0 && min <= 9) {
            min = '0' + min;
        } 
        return hours + ':' + min;
    } else {
        return date + ' ' + month + ' ' + year;
    }
}
