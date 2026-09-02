let weatherForm = document.getElementById("weatherform")
let cityInput = document.getElementById("cityinput")
let API_KEY = "4d57bd1603899ff8664f853f70e70a9f"

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
let forecast = document.getElementById("forecaste")





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

weatherForm.addEventListener("submit", function(event){
    event.preventDefault()
    let city = cityInput.value
    getweather(city)
})













// async function getdata(){
//     let response = await fetch("https://jsonplaceholder.typicode.com/users")
//     let data = await response.json();
//     console.log(data)
// }
// getdata()