const API_KEY = "af9df8c432b34fb885f2389dfe14ffb0";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const unit = document.getElementById("unitSelect").value; // Get the selected unit (metric or imperial)

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            document.getElementById("weatherInfo").innerHTML = "City not found!";
            return;
        }
        
        const temperature = unit === "metric" ? data.main.temp : (data.main.temp * 9/5) + 32; // Convert to Fahrenheit if needed
        const unitSymbol = unit === "metric" ? "°C" : "°F"; // Set the unit symbol based on the selected unit
        document.getElementById("weatherInfo").innerHTML = `
            <p><strong>${data.name}, ${data.sys.country}</strong></p>
            <p>Temperature: ${temperature.toFixed(2)
            } ${unitSymbol}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Visibility: ${data.visibility / 1000} km</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
            <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
            <p>Cloudiness: ${data.clouds.all}%</p>
            <p>Coordinates: ${data.coord.lat}, ${data.coord.lon}</p>
            <p>Timezone: ${data.timezone / 3600} hours</p>
            <p>Feels Like: ${data.main.feels_like} ${unitSymbol}</p>
            <p>Weather Icon: <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></p>
            
        `;
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weatherInfo").innerHTML = "Error fetching weather data.";
        
    }
}