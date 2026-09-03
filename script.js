let weatherForm = document.getElementById("weatherform")
let cityInput = document.getElementById("cityinput")
let API_KEY = "4d57bd1603899ff8664f853f70e70a9f"
let debounceTimer
cityInput.addEventListener("input", function() {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(function() {
        let city = cityInput.value
        if (city.length < 3) {
        return
    }
        console.log("the city is ready",city)
    }, 500)

})
//dark mode
let themeBtn = document.getElementById("themebtn")
    themeBtn.addEventListener("click", function() {
    if(document.body.classList.toggle("dark")){
    themeBtn.textContent = "☀️ Light Mode"
    }else{
        themeBtn.textContent = "🌙 Dark Mode"
    }
})

// data came from fetch
let cityName = document.getElementById("cityname")
let temperature = document.getElementById("temperature")
let humidity = document.getElementById("humidity")
let description = document.getElementById("description")
let loading = document.getElementById("loading")
let errormsg = document.getElementById("error")
let weathericon = document.getElementById("weathericon")
let wind = document.getElementById("wind")


// 5 day forecast
let forecast = document.getElementById("forecast")


// favorate 
let favoriteBtn = document.getElementById("favoritebtn")
let favoritesContainer = document.getElementById("favorites")





async function getweather(city) {
    loading.textContent = "loading"
    try{
    let url = 
        "https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&appid=" + API_KEY
        + "&units=metric"
        console.log(url);

    let response = await fetch(url)
    if(!response.ok){
        throw new Error("city not found")
    }
    let data = await response.json();
     let icon =data.weather[0].icon
     console.log(icon);
     
    weathericon.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
    loading.textContent=""
    errormsg.textContent=""

    console.log(data);
    console.log(data.name);
    console.log(data.main.temp);
    console.log(data.main.humidity);
    console.log(data.weather[0].description);
    console.log(data.wind.speed);

    cityName.textContent = data.name
    temperature.textContent = data.main.temp + " °C"
    humidity.textContent = data.main.humidity + "%"
    description.textContent = data.weather[0].description
    wind.textContent = data.wind.speed + " m/s"
   
    
    }catch (error){
        loading.textContent = ""
        errormsg.textContent = error.message
        
    }

}
async function getforecast(city){
    forecast.innerHTML = ""
    let url =
        "https://api.openweathermap.org/data/2.5/forecast?q="
        + city
        + "&appid=" + API_KEY
        + "&units=metric"


        let response = await fetch(url)
        if (!response.ok) {
        return
        }
        let data = await response.json();
        console.log(data)
        console.log(data.list.length)
        console.log(data.list[0].main.temp)

        for(let i = 0; i < data.list.length; i+=8){
    let card = document.createElement("div")
    let icon = document.createElement("img")
icon.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
    card.classList.add("forecast-card")
    let date = data.list[i].dt_txt.split(" ")[0]
    card.textContent = 
    date + " - " +
    data.list[i].main.temp + " °C - " +
    data.list[i].weather[0].description
    let temp = document.createElement("p")
    temp.textContent = data.list[i].main.temp + " °C"
    card.textContent = date
    let description = document.createElement("p")
    description.textContent = data.list[i].weather[0].description
    card.appendChild(description)
    card.appendChild(temp)
    forecast.appendChild(card)
    card.appendChild(icon)
}

}
let favorites = JSON.parse(localStorage.getItem("favorites")) || []

function addFavorite(city) {
    let button = document.createElement("button")
    button.textContent = city

    let removeButton = document.createElement("button")
    removeButton.textContent = "Remove"

    button.addEventListener("click", function() {
        getweather(city)
        getforecast(city)
    })

    removeButton.addEventListener("click", function() {
        favorites = favorites.filter(function(item) {
            return item !== city
        })

        favoritesContainer.removeChild(button)
        favoritesContainer.removeChild(removeButton)

        localStorage.setItem("favorites", JSON.stringify(favorites))
    })

    favoritesContainer.appendChild(button)
    favoritesContainer.appendChild(removeButton)
}

favoriteBtn.addEventListener("click", function() {
    let city = cityInput.value.trim()

    if (city === "") {
        return
    }

    if (!favorites.includes(city)) {
        favorites.push(city)

        addFavorite(city)

        localStorage.setItem("favorites", JSON.stringify(favorites))
    }
})

weatherForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let city = cityInput.value

    getweather(city)
    getforecast(city)
})

// Load favorites after refresh
favorites.forEach(function(city) {
    addFavorite(city)
})

//favorites
favorites.forEach(function(city) {

    let button = document.createElement("button")
    button.textContent = city

    let removeButton = document.createElement("button")
    removeButton.textContent = "Remove"
    removeButton.addEventListener("click", function() {

    favorites = favorites.filter(function(item) {
        return item !== city
    })
    favoritesContainer.removeChild(button)
    favoritesContainer.removeChild(removeButton)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    console.log(favorites)
})

    button.addEventListener("click", function() {
        getweather(city)
        getforecast(city)
    })

    removeButton.addEventListener("click", function() {
        console.log("Remove clicked")
    })

    favoritesContainer.appendChild(button)
    favoritesContainer.appendChild(removeButton)
})












// async function getdata(){
//     let response = await fetch("https://jsonplaceholder.typicode.com/users")
//     let data = await response.json();
//     console.log(data)
// }
// getdata()