forecast_5_days = [
    {
        day: 14,
        month: 05,
        weather: [
            {
                time: "18:00",
                conditions: {
                    "temp": 261.45,
                    "temp_min": 259.086,
                    "temp_max": 261.45,
                    "pressure": 1023.48,
                    "sea_level": 1045.39,
                    "grnd_level": 1023.48,
                    "humidity": 79,
                    "temp_kf": 2.37
              }
            },
            {
                time: "21:00",
                conditions: {
                    "temp": 261.45,
                    "temp_min": 259.086,
                    "temp_max": 261.45,
                    "pressure": 1023.48,
                    "sea_level": 1045.39,
                    "grnd_level": 1023.48,
                    "humidity": 79,
                    "temp_kf": 2.37
              }
            }
        ]
    },
    {
        day: 15,
        month: 05,
        weather: [
            {
                time: "18:00",
                conditions: {
                    "temp": 261.45,
                    "temp_min": 259.086,
                    "temp_max": 261.45,
                    "pressure": 1023.48,
                    "sea_level": 1045.39,
                    "grnd_level": 1023.48,
                    "humidity": 79,
                    "temp_kf": 2.37
              }
            },
            {
                time: "21:00",
                conditions: {
                    "temp": 261.45,
                    "temp_min": 259.086,
                    "temp_max": 261.45,
                    "pressure": 1023.48,
                    "sea_level": 1045.39,
                    "grnd_level": 1023.48,
                    "humidity": 79,
                    "temp_kf": 2.37
              }
            }
        ]
    }
]




document.querySelector("#get_weather").onsubmit = () => {
    document.querySelector("#get_weather_city_country").style.display = "none"
    document.querySelector("#get_weather").style.display = "block"
    remove_all_child_nodes(document.querySelector("#weather_forecast_list"))
    const location_input = document.querySelector("#location")
    const location = location_input.value

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${APPID}`)
    .then((response) => {
        return response.json()
    })
    .then((data)  => {
        console.log(data)
        if (data.cod === "404" && data.message === "city not found") {
            document.querySelector("#current_weather").innerHTML= `"${location}" is not a valid location. Please enter a valid city name`
            return false
        }
        const temp = data.main.temp
        const country_code = data.sys.country
        document.querySelector("#location_heading").innerHTML = `${capitalize(location)}, ${country_code}`
        document.querySelector("#current_weather").innerHTML = `${temp}° C`
        location_input.value = ""
        document.querySelector("#submit_location").disabled = true
        document.querySelector("#help_with_my_location").style.display = "block"

        // Add event listener for the button we just created in the above line
    })
    .catch((error) => {
        console.log("Error while fetching weather data: " + error)
    })

    // Get weather day forecast
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&APPID=${APPID}`)
    .then((response) => {
        return response.json()
    })
    .then((data)  => {
        console.log(data.list)
        if (data.cod === "404" && data.message === "city not found") {
            document.querySelector("#weather_forecast").innerHTML= `"${location}" is not a valid location. Please enter a valid city name`
            return false
        }
        const forecast_list = data.list
        forecast_list.forEach((forecast) => {
            var li = document.createElement("li")
            li.innerHTML = forecast.dt_txt + " TEMP " + forecast.main.temp + "°C MAX " + forecast.main.temp_max + "°C MIN " + forecast.main.temp_min
            document.querySelector("#weather_forecast_list").append(li)
        })
    })
    .catch((error) => {
        console.log("Error while fetching weather data: " + error)
    })
    return false
}


 // On keyup, if input field has any character => Allow user to submit. Otherwise, submit button disabled.
 document.querySelector("#location").onkeyup = () => {
    if (document.querySelector("#location").value.length === 0) {
        document.querySelector("#submit_location").disabled = true
    } else {
        document.querySelector("#submit_location").disabled = false
    }
}


document.querySelector("#show_location_fields").onclick = () => {
    // document.querySelector("#get_weather").style.display = "none"
    document.querySelector("#help_with_my_location").style.display = "none"
    document.querySelector("#get_weather_city_country").style.display = "block"
    remove_all_child_nodes(document.querySelector("#weather_forecast_list"))
}