let weatherForm = document.getElementById("weatherform")
let cityInput = document.getElementById("cityinput")

let API_KEY = "4d57bd1603899ff8664f853f70e70a9f"

let debounceTimer


// Hidden sections


let weatherCard = document.getElementById("weather-card")
let favoriteContainer = document.getElementById("favorite-container")
let forecastTitle = document.getElementById("forecast-title")
let forecast = document.getElementById("forecast")



// Debounce


cityInput.addEventListener("input", function() {

    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(function() {

        let city = cityInput.value

        if (city.length < 3) {
            return
        }

        console.log("the city is ready", city)

    }, 500)

})



// Dark mode


let themeBtn = document.getElementById("themebtn")

themeBtn.addEventListener("click", function() {

    if (document.body.classList.toggle("dark")) {

        themeBtn.textContent = "☀️ Light Mode"

    } else {

        themeBtn.textContent = "🌙 Dark Mode"

    }

})



// Weather elements


let cityName = document.getElementById("cityname")
let temperature = document.getElementById("temperature")
let humidity = document.getElementById("humidity")
let description = document.getElementById("description")
let loading = document.getElementById("loading")
let errormsg = document.getElementById("error")
let weathericon = document.getElementById("weathericon")
let wind = document.getElementById("wind")



// Favorite


let favoriteBtn = document.getElementById("favoritebtn")
let favoritesContainer = document.getElementById("favorites")

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || []



// Get weather


async function getweather(city) {

    loading.textContent = "loading"

    try {

        let url =
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&appid=" + API_KEY
            + "&units=metric"


        let response = await fetch(url)


        if (!response.ok) {

            throw new Error("city not found")

        }


        let data = await response.json()


        let icon = data.weather[0].icon


        weathericon.src =
            "https://openweathermap.org/img/wn/"
            + icon
            + "@2x.png"


        loading.textContent = ""
        errormsg.textContent = ""


        cityName.textContent = data.name

        temperature.textContent =
            data.main.temp + " °C"

        humidity.textContent =
            data.main.humidity + "%"

        description.textContent =
            data.weather[0].description

        wind.textContent =
            data.wind.speed + " m/s"


        // Show sections after successful search

        weatherCard.style.visibility = "visible"

        favoriteContainer.style.display = "block"

        forecastTitle.style.display = "block"

        forecast.style.display = "flex"


        return true


    } catch (error) {

        loading.textContent = ""

        errormsg.textContent = error.message

        return false

    }

}


// Get forecast


async function getforecast(city) {

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


    let data = await response.json()


    for (let i = 0; i < data.list.length; i += 8) {

        let card = document.createElement("div")

        let icon = document.createElement("img")


        icon.src =
            "https://openweathermap.org/img/wn/"
            + data.list[i].weather[0].icon
            + "@2x.png"


        card.classList.add("forecast-card")


        let date =
            data.list[i].dt_txt.split(" ")[0]


        card.textContent = date


        let temp = document.createElement("p")


        temp.textContent =
            data.list[i].main.temp + " °C"


        let description =
            document.createElement("p")


        description.textContent =
            data.list[i].weather[0].description


        card.appendChild(description)

        card.appendChild(temp)

        card.appendChild(icon)

        forecast.appendChild(card)

    }

}


// Add favorite


function addFavorite(city) {

    let button =
        document.createElement("button")


    button.textContent = city


    let removeButton =
        document.createElement("button")


    removeButton.textContent = "Remove"

    removeButton.classList.add("remove-favorite")


    let favoriteItem =
        document.createElement("div")


    favoriteItem.classList.add("favorite-item")


    favoriteItem.appendChild(button)

    favoriteItem.appendChild(removeButton)


    favoritesContainer.appendChild(favoriteItem)


    button.addEventListener("click", function() {

        getweather(city)

        getforecast(city)

    })


    removeButton.addEventListener("click", function() {

        favorites = favorites.filter(function(item) {

            return item !== city

        })


        favoriteItem.remove()


        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        )

    })

}



// Save favorite


favoriteBtn.addEventListener("click", function() {

    let city = cityInput.value.trim()


    if (city === "") {

        return

    }


    if (!favorites.includes(city)) {

        favorites.push(city)

        addFavorite(city)


        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        )

    }

})



// Search weather


weatherForm.addEventListener("submit", async function(event) {

    event.preventDefault()


    let city = cityInput.value.trim()


    if (city === "") {

        return

    }


    // First get weather

    let success = await getweather(city)


    // Only get forecast if city exists

    if (success) {

        getforecast(city)

    }

})



// Load favorites


favorites.forEach(function(city) {

    addFavorite(city)

})