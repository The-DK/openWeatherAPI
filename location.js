// API Key
const APPID = "551cb4cbd76747999094a8d7a61d1b4d"
const total_forecast_divs_on_main_page = 5
const div_initial_ID = "forecast_day"
const div_date_ending_ID = "_date"
const div_hour_middle_ID = "_hour"
const div_temp_ending_ID = "_temp"
const div_time_ending_ID = "_time"
const div_feelsLike_ending_ID = "_feelsLike"
const div_tempMax_ending_ID = "_max"
const div_tempMin_ending_ID = "_min"
const div_current_weather_ID= "current_weather"
const div_description_ID = "_description"

function get_month(month_no) {
    if (month_no === 1) {
        return "Jan"
    } else if (month_no === 2) {
        return "Feb"
    } else if (month_no === 3) {
        return "March"
    } else if (month_no === 4) {
        return "April"
    } else if (month_no === 5) {
        return "May"
    } else if (month_no === 6) {
        return "June"
    } else if (month_no === 7) {
        return "July"
    } else if (month_no === 8) {
        return "Aug"
    } else if (month_no === 9) {
        return "Sept"
    } else if (month_no === 10) {
        return "Oct"
    } else if (month_no === 11) {
        return "Nov"
    } else if (month_no === 12) {
        return "Dec"
    }
    return ""
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function remove_all_child_nodes(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild)
    }
    // console.log("Remove all child nodes was called")
}

function add_month_temp_to_divs(day, month, weather, day_no) {
    show_forecast_divs(day_no)
    let forecast_days = 2
    if (weather.length < 2) {
        forecast_days = weather.length
    }
    const date_id = div_initial_ID + `${day_no}` + div_date_ending_ID
    document.querySelector(`#${date_id}`).innerHTML = `${day} ` + month
    for (let index = 0; index < forecast_days; index++) {
        const time_id = div_initial_ID + `${day_no}` + div_hour_middle_ID + `${index+1}` + div_time_ending_ID
        const temp_id = div_initial_ID + `${day_no}` + div_hour_middle_ID + `${index+1}` + div_temp_ending_ID
        const feelsLike_id = temp_id + div_feelsLike_ending_ID
        const tempMax_id = temp_id + div_tempMax_ending_ID
        const tempMin_id = temp_id + div_tempMin_ending_ID
        document.querySelector(`#${time_id}`).innerHTML = weather[index].time
        document.querySelector(`#${temp_id}`).innerHTML = '<span class="temp">' + weather[index].conditions.temp + "&deg; C</span>"
        document.querySelector(`#${feelsLike_id}`).innerHTML = '<span class="sm_data">feels like</span> <span class="lg_data">' + weather[index].conditions.feels_like + "&deg;</span> C"
        document.querySelector(`#${tempMin_id}`).innerHTML = 'min temp <span class="lg_data">' + weather[index].conditions.temp_min + '&deg;</span> C'
        document.querySelector(`#${tempMax_id}`).innerHTML = 'max temp <span class="lg_data">' + weather[index].conditions.temp_max + '&deg;</span> C'
    }
}

function divide_forecast(data) {
    var forecast_5_days = []
    var current_day = -1
    var current_date_obj = {}
    data.forEach((hour_forecast) => {
        var hour_day = parseInt(hour_forecast.dt_txt[8] + hour_forecast.dt_txt[9])
        var hour_month = parseInt(hour_forecast.dt_txt[5] + hour_forecast.dt_txt[6])
        const time = hour_forecast.dt_txt.substr(11, 5)
        const conditions = hour_forecast.main
        if (current_day != hour_day) {
            if ((Object.keys(current_date_obj).length === 0 && current_date_obj.constructor === Object) === false) {
                forecast_5_days.push(current_date_obj)
            }
            // Reset current date object
            current_date_obj = {}
            current_day = hour_day
            current_date_obj.day = current_day
            current_date_obj.month = hour_month
            current_date_obj.weather = []
        }
        current_date_obj.weather.push({time: time, conditions: conditions})
    })
    return forecast_5_days
}

function hide_current_and_forecast_divs() {
    document.querySelector("#current_conditions").style.display = "none"
    for (let index = 0; index < total_forecast_divs_on_main_page; index++) {
        document.querySelector(`#${div_initial_ID}${index+1}`).style.display = "none"
    }
}

function show_forecast_divs(div_no) {
    document.querySelector(`#${div_initial_ID}${div_no}`).style.display = "block"
}

document.addEventListener("DOMContentLoaded", () => {
    // Default, Submit button is disabled
    document.querySelector("#submit_city_country_location").disabled = true
    document.querySelector("#weather_forecast").style.display = "none"
    hide_current_and_forecast_divs()

    document.querySelector("#city").onkeyup = () => {
        if (document.querySelector("#city").value.length === 0) {
            document.querySelector("#submit_city_country_location").disabled = true
        } else {
            document.querySelector("#submit_city_country_location").disabled = false
        }
    }

    document.querySelector("#country").onkeyup = () => {
        if (document.querySelector("#city").value.length === 0 && document.querySelector("#country").value.length === 0) {
            document.querySelector("#submit_city_country_location").disabled = true
        } else {
            document.querySelector("#submit_city_country_location").disabled = false
        }
    }

    // On submit, make request to API for the location provided by user. No error checking on valid location names yet.
  
    document.querySelector("#get_weather_city_country").onsubmit = () => {
        remove_all_child_nodes(document.querySelector("#weather_forecast_list"))
        const city_input = document.querySelector("#city")
        const city = city_input.value
        const country_input = document.querySelector("#country")
        const country = country_input.value

        // console.log("City: " + city)
        // console.log("Country: " + country)

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country.toLowerCase()}&units=metric&APPID=${APPID}`)
        .then((response) => {
            return response.json()
        })
        .then((data)  => {
            // console.log(data)
            // console.log(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country.toLowerCase()}&units=metric&APPID=${APPID}`)
            if (data.cod === "404" && data.message === "city not found") {
                // document.querySelector("#current_weather").innerHTML= `${city}, ${country} is not a valid location. Please enter a valid city, country name`
                return false
            }
            const temp = data.main.temp
            const country_code = data.sys.country
            const city_name = data.name
            const temp_min = data.main.temp_min
            const temp_max = data.main.temp_max
            const current_weather_temp_max = div_current_weather_ID + div_temp_ending_ID + div_tempMax_ending_ID
            const current_weather_temp_min = div_current_weather_ID + div_temp_ending_ID + div_tempMin_ending_ID
            const current_weather_description = div_current_weather_ID + div_description_ID
            document.querySelector("#current_conditions").style.display = "block"
            document.querySelector("#location_heading").innerHTML = `${city_name}, ${country_code}`
            document.querySelector(`#${div_current_weather_ID}`).innerHTML = `${temp}° C`
            document.querySelector(`#${current_weather_description}`).innerHTML = data.weather[0].description
            document.querySelector(`#${current_weather_temp_min}`).innerHTML = '<span class="current_weather_data">min temp</span> <span class="lg_data_current_weather">' + temp_min + '&deg;</span> C'
            document.querySelector(`#${current_weather_temp_max}`).innerHTML = '<span class="current_weather_data">max temp</span> <span class="lg_data_current_weather">' + temp_max + '&deg;</span> C'
            city_input.value = ""
            // country_input.value = ""
            document.querySelector("#submit_city_country_location").disabled = true
        })
        .catch((error) => {
            console.log("Error while fetching weather data: " + error)
        })
        // IMPLEMENT FORECAST API CALL HERE AS WELL

        // console.log(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&APPID=${APPID}`)
        // Get weather day forecast
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&APPID=${APPID}`)
        .then((response) => {
            return response.json()
        })
        .then((data)  => {
            // console.log(data)
            if (data.cod === "404" && data.message === "city not found") {
                document.querySelector("#weather_forecast").style.display = "block"
                document.querySelector("#weather_forecast").innerHTML= `${city}, ${country} is not a valid location. Please enter a valid location`
                return false
            }
            const forecast_list = data.list
            const each_day_forecast = divide_forecast(forecast_list)
            // console.log(each_day_forecast)
            each_day_forecast.forEach((forecast, index) => {
                const month_name = get_month(forecast.month)
                add_month_temp_to_divs(forecast.day, month_name, forecast.weather, index+1)
            })
            document.querySelector("#weather_forecast").style.display = "none"
        })
        .catch((error) => {
            console.log("Error while fetching weather data: " + error)
        })
        return false
    }
})